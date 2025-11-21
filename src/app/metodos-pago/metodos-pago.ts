
import {Component, OnInit} from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import {MetodoPagoDTO} from '../../model/MetodoPagoDTO';
import {PagoService} from '../Services/pago-service';
import {CrearMetodoPagoDTO} from '../../model/crear-metodo-pago.dto';
import {AuthService} from '../Services/auth-service';
import {FormsModule} from '@angular/forms';


interface MetodoPago {
  id: number;
  tipo: 'Billetera Digital' | 'Tarjeta' | 'Cuenta bancaria';
  detalle: string;
  iconoClase: string;
  esPredeterminado: boolean;
}

@Component({
  selector: 'app-metodos-pago',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './metodos-pago.html',
  styleUrl: './metodos-pago.css',
})
export class MetodosPago implements OnInit {
  metodos: MetodoPagoDTO[] = [];
  usuarioId: number | null = null;
  cargando: boolean = false;
  mostrandoModal: boolean = false;


  nuevoMetodo: CrearMetodoPagoDTO = {
    tipo: 'tarjeta_credito',
    tokenProveedor: '',
    usuarioId: 0,
    predeterminado: false
  };

  // Opciones para el formulario
  tiposMetodoPago = [
    { value: 'tarjeta_credito', label: 'Tarjeta de Crédito', icon: '💳' },
    { value: 'billetera_digital', label: 'Billetera Digital', icon: '👛' },
    { value: 'transferencia', label: 'Transferencia Bancaria', icon: '🏛️' }
  ];

  constructor(
    private pagoService: PagoService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    console.log('🔍 Inicializando MetodosPago...');
    this.verificarUsuario();
    this.cargarMetodosPago();
  }
  verificarUsuario(): void {
    this.usuarioId = this.authService.getUserId();
    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      alert('Debe iniciar sesión para gestionar métodos de pago');
      return;
    }
    this.nuevoMetodo.usuarioId = this.usuarioId;
  }

  cargarMetodosPago(): void {
    if (!this.usuarioId) return;

    console.log('🔍 Cargando métodos de pago para usuario:', this.usuarioId);

    this.cargando = true;
    this.pagoService.obtenerMetodosPagoUsuario(this.usuarioId).subscribe({
      next: (metodos) => {
        console.log('🔍 Métodos de pago recibidos del backend:', metodos);
        this.metodos = metodos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error cargando métodos de pago:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Mensaje:', error.message);
        console.error('❌ Error completo:', error);
        this.cargando = false;
        alert('Error al cargar los métodos de pago: ' + error.message);
      }
    });
  }


  abrirModal(): void {
    this.mostrandoModal = true;
    this.nuevoMetodo = {
      tipo: 'tarjeta_credito',
      tokenProveedor: this.generarTokenSimulado(),
      usuarioId: this.usuarioId!,
      predeterminado: this.metodos.length === 0
    };
  }

  cerrarModal(): void {
    this.mostrandoModal = false;
  }

  generarTokenSimulado(): string {
    return 'tok_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
  }

  agregarMetodo(): void {
    if (!this.validarFormulario()) return;

    console.log('🔍 Intentando agregar método:', this.nuevoMetodo);

    this.cargando = true;
    this.pagoService.agregarMetodoPago(this.nuevoMetodo).subscribe({
      next: (respuesta) => {
        console.log('🔍 Respuesta del backend al agregar método:', respuesta);
        this.cargando = false;
        if (respuesta.exito) {
          console.log('✅ Método agregado exitosamente:', respuesta.metodoPago);
          this.cerrarModal();
          this.cargarMetodosPago();
          alert('Método de pago agregado exitosamente');
        } else {
          console.error('❌ Error del backend:', respuesta.mensaje);
          alert('Error: ' + respuesta.mensaje);
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('❌ Error HTTP al agregar método:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Mensaje:', error.message);
        console.error('❌ Error completo:', error);
        alert('Error al agregar método de pago: ' + error.message);
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.nuevoMetodo.tipo) {
      alert('Por favor seleccione un tipo de método de pago');
      return false;
    }
    return true;
  }

  eliminarMetodo(id: number): void {
    const metodoAEliminar = this.metodos.find(m => m.id === id);
    if (!metodoAEliminar || !this.usuarioId) return;

    if (confirm(`¿Estás seguro de que quieres eliminar ${this.getTipoLegible(metodoAEliminar.tipo)}?`)) {
      this.pagoService.eliminarMetodoPago(id, this.usuarioId).subscribe({
        next: (respuesta) => {
          if (respuesta.exito) {
            console.log('Método eliminado:', respuesta.mensaje);
            this.cargarMetodosPago(); // Recargar la lista
          } else {
            alert('Error: ' + respuesta.mensaje);
          }
        },
        error: (error) => {
          console.error('Error eliminando método:', error);
          alert('Error al eliminar método de pago');
        }
      });
    }
  }

  establecerPredeterminado(id: number): void {
    console.log('Estableciendo método predeterminado:', id);
    // En una implementación real, necesitarías un endpoint para actualizar el método predeterminado
    // Por ahora solo mostramos un mensaje
    alert('Funcionalidad de establecer predeterminado en desarrollo');
  }


  getTipoLegible(tipo: string): string {
    const tipoEncontrado = this.tiposMetodoPago.find(t => t.value === tipo);
    return tipoEncontrado ? tipoEncontrado.label : tipo;
  }


  getIcono(tipo: string): string {
    const tipoEncontrado = this.tiposMetodoPago.find(t => t.value === tipo);
    return tipoEncontrado ? tipoEncontrado.icon : '💳';
  }


  getTipoSeleccionadoLabel(): string {
    const tipoEncontrado = this.tiposMetodoPago.find(t => t.value === this.nuevoMetodo.tipo);
    return tipoEncontrado ? tipoEncontrado.label : '';
  }
}
