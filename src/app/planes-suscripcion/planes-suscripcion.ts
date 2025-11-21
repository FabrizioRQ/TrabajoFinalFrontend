import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { PlanSuscripcionDTO } from '../../model/plan-suscripcion.dto';
import { PagoService } from '../Services/pago-service';
import { Router } from '@angular/router';
import { SeleccionPlanDTO } from '../../model/selecionarPlan-dto.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth-service';
import { MetodoPagoDTO } from '../../model/MetodoPagoDTO';
import { CrearMetodoPagoDTO } from '../../model/crear-metodo-pago.dto';

@Component({
  selector: 'app-planes-suscripcion',
  standalone: true,
  imports: [CommonModule, NgFor, NgClass, FormsModule],
  templateUrl: './planes-suscripcion.html',
  styleUrl: './planes-suscripcion.css',
})
export class PlanesSuscripcion implements OnInit {
  planes: PlanSuscripcionDTO[] = [];
  metodosPago: MetodoPagoDTO[] = [];
  usuarioId: number | null = null;
  cargando: boolean = false;
  metodoPagoSeleccionado: string = '';
  planSeleccionado: string = '';
  nombreUsuario: string = '';

  mostrandoModalPago: boolean = false;
  agregandoMetodo: boolean = false;

  nuevoMetodo: CrearMetodoPagoDTO = {
    tipo: 'tarjeta_credito',
    tokenProveedor: '',
    usuarioId: 0,
    predeterminado: false
  };

  tiposMetodoPago = [
    { value: 'tarjeta_credito', label: 'Tarjeta de Crédito', icon: '💳' },
    { value: 'billetera_digital', label: 'Billetera Digital', icon: '👛' },
    { value: 'transferencia', label: 'Transferencia Bancaria', icon: '🏛️' }
  ];

  constructor(
    private pagoService: PagoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('🔍 Inicializando PlanesSuscripcion...');
    this.verificarUsuario();
    this.cargarPlanesDisponibles();
    this.cargarMetodosPago();
  }

  verificarUsuario(): void {
    this.usuarioId = this.authService.getUserId();
    this.nombreUsuario = this.authService.getNombreUsuario() || 'Usuario';

    console.log('🔍 Usuario verificado:', {
      usuarioId: this.usuarioId,
      nombreUsuario: this.nombreUsuario
    });

    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      alert('Debe iniciar sesión para seleccionar un plan');
      return;
    }

    this.nuevoMetodo.usuarioId = this.usuarioId;
  }

  cargarPlanesDisponibles(): void {
    this.cargando = true;
    this.pagoService.obtenerPlanesDisponibles().subscribe({
      next: (planes) => {
        this.planes = planes;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando planes:', error);
        this.cargando = false;
      }
    });
  }

  cargarMetodosPago(): void {
    if (!this.usuarioId) return;

    console.log('🔍 Cargando métodos de pago para usuario:', this.usuarioId);

    this.pagoService.obtenerMetodosPagoUsuario(this.usuarioId).subscribe({
      next: (metodos) => {
        console.log('🔍 Métodos de pago cargados:', metodos);
        this.metodosPago = metodos;
        const metodoPredeterminado = metodos.find(m => m.predeterminado);
        if (metodoPredeterminado) {
          this.metodoPagoSeleccionado = metodoPredeterminado.id.toString();
        } else if (metodos.length > 0) {
          this.metodoPagoSeleccionado = metodos[0].id.toString();
        }
        console.log('🔍 Método seleccionado por defecto:', this.metodoPagoSeleccionado);
      },
      error: (error) => {
        console.error('❌ Error cargando métodos de pago:', error);
        console.error('❌ Detalles del error:', error.error);
      }
    });
  }

  seleccionarPlan(codigoPlan: string): void {
    if (this.cargando) return;

    this.planSeleccionado = codigoPlan;

    if (codigoPlan === 'anonimo') {
      this.procesarSeleccionPlan(codigoPlan, '');
      return;
    }

    if (this.metodosPago.length === 0) {
      // Mostrar modal para agregar método de pago en lugar de redirigir
      this.mostrarModalAgregarPago();
      return;
    }

    this.mostrarModalConfirmacion();
  }

  mostrarModalAgregarPago(): void {
    this.mostrandoModalPago = true;
    this.nuevoMetodo = {
      tipo: 'tarjeta_credito',
      tokenProveedor: this.generarTokenSimulado(),
      usuarioId: this.usuarioId!,
      predeterminado: true // Será el primer método
    };

    console.log('🔍 Plan seleccionado para suscripción:', this.planSeleccionado);
  }

  cerrarModalPago(): void {
    this.mostrandoModalPago = false;
  }

  generarTokenSimulado(): string {
    return 'tok_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
  }

  agregarMetodoPago(): void {
    if (!this.validarFormularioMetodoPago()) return;

    this.agregandoMetodo = true;
    this.pagoService.agregarMetodoPago(this.nuevoMetodo).subscribe({
      next: (respuesta) => {
        this.agregandoMetodo = false;
        if (respuesta.exito) {
          console.log('✅ Método agregado exitosamente:', respuesta.metodoPago);
          this.cerrarModalPago();

          // Guardar el ID del nuevo método para usarlo inmediatamente
          this.metodoPagoSeleccionado = respuesta.metodoPago.id.toString();

          // Ahora procesar la suscripción al plan que estaba seleccionado
          this.procesarSeleccionPlan(this.planSeleccionado, this.metodoPagoSeleccionado);

        } else {
          alert('Error: ' + respuesta.mensaje);
        }
      },
      error: (error) => {
        this.agregandoMetodo = false;
        console.error('❌ Error HTTP al agregar método:', error);
        alert('Error al agregar método de pago: ' + error.message);
      }
    });
  }
  validarFormularioMetodoPago(): boolean {
    if (!this.nuevoMetodo.tipo) {
      alert('Por favor seleccione un tipo de método de pago');
      return false;
    }
    return true;
  }

  mostrarModalConfirmacion(): void {
    const plan = this.planes.find(p => p.codigo === this.planSeleccionado);
    const metodo = this.metodosPago.find(m => m.id.toString() === this.metodoPagoSeleccionado);

    if (!plan || !metodo) return;

    const confirmacion = confirm(
      `¿Confirmar suscripción al plan ${plan.nombre}?\n\n` +
      `Precio: $${plan.precioMensual}/mes\n` +
      `Método de pago: ${this.getTipoLegible(metodo.tipo)} (${metodo.ultimosDigitos})\n\n` +
      `¿Desea continuar?`
    );

    if (confirmacion) {
      this.procesarSeleccionPlan(this.planSeleccionado, this.metodoPagoSeleccionado);
    }
  }

  procesarSeleccionPlan(codigoPlan: string, metodoPagoId: string): void {
    this.cargando = true;

    const seleccionDTO: SeleccionPlanDTO = {
      codigoPlan: codigoPlan,
      usuarioId: this.usuarioId!,
      metodoPago: metodoPagoId
    };

    this.pagoService.seleccionarPlan(seleccionDTO).subscribe({
      next: (respuesta) => {
        this.cargando = false;

        if (respuesta.exito) {
          console.log('Plan seleccionado exitosamente:', respuesta.planSeleccionado);

          const planNombre = this.planes.find(p => p.codigo === respuesta.planSeleccionado)?.nombre || 'Plan';
          alert(`¡Felicidades! Has activado el plan ${planNombre}\n\n${respuesta.mensaje}`);

          if (respuesta.redireccion === 'chat') {
            this.router.navigate(['/chat']);
          } else if (respuesta.redireccion === 'pago') {
            this.router.navigate(['/user-panel/metodos-pago']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          alert('Error: ' + respuesta.mensaje);
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error seleccionando plan:', error);
        alert('Error al seleccionar el plan. Por favor, intente nuevamente.');
      }
    });
  }

  omitirSeleccion(): void {
    this.seleccionarPlan('anonimo');
  }

  formatearPrecio(precio: number): string {
    return precio === 0 ? 'Gratis' : `$${precio.toFixed(2)}/mes`;
  }

  parsearCaracteristicas(caracteristicas: string): any {
    try {
      return JSON.parse(caracteristicas);
    } catch (e) {
      return {};
    }
  }

  obtenerCaracteristicasArray(caracteristicas: string): string[] {
    const parsed = this.parsearCaracteristicas(caracteristicas);
    return Object.entries(parsed).map(([key, value]) => {
      if (key === 'sesiones_mensuales') return `🎯 ${value} sesiones mensuales`;
      if (key === 'soporte') return `🛟 Soporte ${value}`;
      if (key === 'monstruos') return `👾 ${value} monstruos disponibles`;
      return `${key}: ${value}`;
    });
  }

  esPlanDestacado(plan: PlanSuscripcionDTO): boolean {
    return plan.codigo === 'gold' || plan.codigo === 'platinum';
  }

  getTipoLegible(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'tarjeta_credito': 'Tarjeta de Crédito',
      'billetera_digital': 'Billetera Digital',
      'transferencia': 'Transferencia Bancaria'
    };
    return tipos[tipo] || tipo;
  }

  getTipoSeleccionadoLabel(): string {
    const tipoEncontrado = this.tiposMetodoPago.find(t => t.value === this.nuevoMetodo.tipo);
    return tipoEncontrado ? tipoEncontrado.label : '';
  }

  getIcono(tipo: string): string {
    const tipoEncontrado = this.tiposMetodoPago.find(t => t.value === tipo);
    return tipoEncontrado ? tipoEncontrado.icon : '💳';
  }

  gestionarMetodosPago(): void {
    this.router.navigate(['/user-panel/metodos-pago']);
  }
}
