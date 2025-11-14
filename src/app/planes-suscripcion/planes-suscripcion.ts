import {Component, OnInit} from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import {PlanSuscripcionDTO} from '../../model/plan-suscripcion.dto';
import {PagoService} from '../Services/pago-service';
import {Router} from '@angular/router';
import {SeleccionPlanDTO} from '../../model/selecionarPlan-dto.model';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../Services/auth-service';
import {MetodoPagoDTO} from '../../model/MetodoPagoDTO'; // NgFor y NgClass son útiles aquí

interface PlanSuscripcion {
  id: string;
  nombre: string;
  precio: string;
  caracteristicas: string[];
  isDestacado?: boolean;
  colorClase?: string;
}

@Component({
  selector: 'app-planes-suscripcion',
  standalone: true,
  imports: [CommonModule, NgFor, NgClass, FormsModule], // Incluimos NgFor para iterar y NgClass para estilos condicionales
  templateUrl: './planes-suscripcion.html',
  styleUrl: './planes-suscripcion.css',
})
export class PlanesSuscripcion implements OnInit  {
  planes: PlanSuscripcionDTO[] = [];
  metodosPago: MetodoPagoDTO[] = [];
  usuarioId: number | null = null;
  cargando: boolean = false;
  metodoPagoSeleccionado: string = '';
  planSeleccionado: string = '';
  nombreUsuario: string = '';

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
      alert('Necesitas agregar un método de pago antes de seleccionar un plan de pago');
      this.router.navigate(['/metodos-pago']);
      return;
    }

    this.mostrarModalConfirmacion();
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

  getMetodoSeleccionado(): MetodoPagoDTO | undefined {
    return this.metodosPago.find(m => m.id.toString() === this.metodoPagoSeleccionado);
  }

  gestionarMetodosPago(): void {
    this.router.navigate(['/user-panel/metodos-pago']);
  }
}
