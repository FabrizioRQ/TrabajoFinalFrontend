import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService, EstadoSuscripcionDTO, CancelacionSuscripcionDTO, RespuestaSimpleDTO } from '../Services/pago-service';
import { AuthService } from '../Services/auth-service';

@Component({
  selector: 'app-cancelar-suscripcion',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './cancelar-suscripcion.html',
  styleUrl: './cancelar-suscripcion.css',
})
export class CancelarSuscripcion implements OnInit {
  // --- Estado Principal ---
  estadoSuscripcion: EstadoSuscripcionDTO | null = null;
  usuarioId: number | null = null;
  cargando: boolean = false;

  // --- Estado del Modal de Confirmación ---
  mostrarModalPausa: boolean = false;
  mostrarModalCancelacion: boolean = false;

  // --- Datos del Modal de Cancelación ---
  motivosCancelacion: string[] = [
    'Alto costo',
    'Falta de uso',
    'Problemas técnicos',
    'Ya no necesito el servicio',
    'Otro'
  ];
  motivoSeleccionado: string = '';

  // --- Opciones del Modal de Pausa/Confirmación ---
  estoySeguro: boolean = false;
  pausarPagos: boolean = false;

  constructor(
    private pagoService: PagoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.verificarUsuario();
    this.cargarEstadoSuscripcion();
  }

  verificarUsuario(): void {
    this.usuarioId = this.authService.getUserId();
    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      alert('Debe iniciar sesión para gestionar la suscripción');
      return;
    }
  }

  cargarEstadoSuscripcion(): void {
    if (!this.usuarioId) return;

    this.cargando = true;
    this.pagoService.obtenerMiEstadoSuscripcion().subscribe({
      next: (estado) => {
        this.estadoSuscripcion = estado;
        this.cargando = false;
        console.log('Estado de suscripción cargado:', estado);
      },
      error: (error) => {
        console.error('Error cargando estado de suscripción:', error);
        this.cargando = false;
        alert('Error al cargar el estado de la suscripción');
      }
    });
  }

  get suscripcionActiva(): boolean {
    return this.estadoSuscripcion?.activa || false;
  }

  get suscripcionPausada(): boolean {
    return this.estadoSuscripcion?.pausada || false;
  }

  get planActual(): string {
    if (!this.estadoSuscripcion?.planActual) return 'Sin plan';

    const planes: { [key: string]: string } = {
      'standard': 'Standard',
      'vip': 'VIP',
      'gold': 'Gold',
      'platinum': 'Platinum',
      'anonimo': 'Gratuito'
    };

    return planes[this.estadoSuscripcion.planActual] || this.estadoSuscripcion.planActual;
  }

  get fechaProximoPago(): string {
    if (!this.estadoSuscripcion?.fechaProximoPago) return 'No disponible';

    const fecha = new Date(this.estadoSuscripcion.fechaProximoPago);
    return fecha.toLocaleDateString('es-ES');
  }

  // --- Lógica de Acciones ---

  iniciarPausa(): void {
    if (this.suscripcionActiva) {
      this.mostrarModalPausa = true;
      this.estoySeguro = false;
      this.pausarPagos = false;
      this.motivoSeleccionado = '';
      console.log('Abriendo modal para pausar suscripción.');
    } else {
      alert('La suscripción no está activa.');
    }
  }

  confirmarPausa(): void {
    if (!this.estoySeguro || !this.usuarioId) {
      alert('Debes confirmar que estás seguro para continuar.');
      return;
    }

    this.cargando = true;
    const cancelacionDTO: CancelacionSuscripcionDTO = {
      usuarioId: this.usuarioId,
      motivo: this.motivoSeleccionado || 'Pausa temporal',
      pausarPagos: this.pausarPagos
    };

    this.pagoService.pausarSuscripcion(cancelacionDTO).subscribe({
      next: (respuesta: RespuestaSimpleDTO) => {
        this.cargando = false;
        if (respuesta.exito) {
          console.log('Suscripción pausada:', respuesta.mensaje);
          this.cerrarModales();
          this.cargarEstadoSuscripcion(); // Recargar estado
          alert('Suscripción pausada temporalmente.');
        } else {
          alert('Error: ' + respuesta.mensaje);
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error pausando suscripción:', error);
        alert('Error al pausar la suscripción');
      }
    });
  }

  iniciarCancelacion(): void {
    if (this.suscripcionActiva) {
      this.mostrarModalCancelacion = true;
      this.motivoSeleccionado = '';
      console.log('Abriendo modal para cancelación permanente.');
    } else {
      alert('La suscripción no está activa para cancelar.');
    }
  }

  confirmarCancelacion(): void {
    if (!this.usuarioId) return;

    this.cargando = true;
    const cancelacionDTO: CancelacionSuscripcionDTO = {
      usuarioId: this.usuarioId,
      motivo: this.motivoSeleccionado || 'Cancelación permanente',
      pausarPagos: false
    };

    this.pagoService.cancelarSuscripcion(cancelacionDTO).subscribe({
      next: (respuesta: RespuestaSimpleDTO) => {
        this.cargando = false;
        if (respuesta.exito) {
          console.log('Suscripción cancelada:', respuesta.mensaje);
          this.cerrarModales();
          this.cargarEstadoSuscripcion(); // Recargar estado
          alert('Suscripción cancelada permanentemente.');
        } else {
          alert('Error: ' + respuesta.mensaje);
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error cancelando suscripción:', error);
        alert('Error al cancelar la suscripción');
      }
    });
  }

  cerrarModales(): void {
    this.mostrarModalPausa = false;
    this.mostrarModalCancelacion = false;
    this.estoySeguro = false;
    this.pausarPagos = false;
    this.motivoSeleccionado = '';
  }

  reactivarSuscripcion(): void {
    if (!this.usuarioId) return;

    if (this.suscripcionPausada) {
      this.cargando = true;
      this.pagoService.reactivarSuscripcion(this.usuarioId).subscribe({
        next: (respuesta: RespuestaSimpleDTO) => {
          this.cargando = false;
          if (respuesta.exito) {
            console.log('Suscripción reactivada:', respuesta.mensaje);
            this.cargarEstadoSuscripcion(); // Recargar estado
            alert('Suscripción reactivada con éxito!');
          } else {
            alert('Error: ' + respuesta.mensaje);
          }
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error reactivando suscripción:', error);
          alert('Error al reactivar la suscripción');
        }
      });
    } else {
      alert('No se puede reactivar una suscripción cancelada permanentemente.');
    }
  }

  // Método para formatear fechas
  formatearFecha(fecha: string | null): string {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
