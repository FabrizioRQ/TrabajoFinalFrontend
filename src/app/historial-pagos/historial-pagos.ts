import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagoDTO } from '../../model/pago-dto.model';
import { PagoService,
  ReporteTotalUsuario,
  ReporteEstadoMetodo,
  ReporteIngresosMensuales,
  ReporteTopUsuarios } from '../Services/pago-service';

@Component({
  selector: 'app-historial-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.css',
})
export class HistorialPagos implements OnInit {
  // Datos principales
  historial: PagoDTO[] = [];

  // Nuevos reportes
  totalesPorUsuario: ReporteTotalUsuario[] = [];
  conteoEstadoMetodo: ReporteEstadoMetodo[] = [];
  ingresosMensuales: ReporteIngresosMensuales[] = [];
  topUsuarios: ReporteTopUsuarios[] = [];

  // Filtros
  fechaInicio: string;
  fechaFin: string;

  // Estados
  cargando = false;
  pestanaActiva = 'historial';

  // Estadísticas rápidas
  estadisticas = {
    totalIngresos: 0,
    pagosCompletados: 0,
    usuariosActivos: 0,
    ingresoPromedio: 0
  };

  constructor(private pagoService: PagoService) {
    // Fechas por defecto (últimos 30 días)
    const fin = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - 30);

    this.fechaInicio = inicio.toISOString().split('T')[0];
    this.fechaFin = fin.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarTodosLosDatos();
  }

  cargarTodosLosDatos(): void {
    this.cargarHistorialPagos();
    this.cargarIngresosMensuales();
    this.cargarConteoEstadoMetodo();
    this.cargarTopUsuarios();
    this.cargarTotalesPorUsuario();
  }

  cargarHistorialPagos(): void {
    this.cargando = true;
    const usuarioId = this.pagoService.getUsuarioId();

    console.log('🔄 Cargando historial para usuario ID:', usuarioId);

    this.pagoService.listarPagos().subscribe({
      next: (pagos: PagoDTO[]) => {
        console.log('📦 Todos los pagos recibidos del backend:', pagos);

        // DEPURACIÓN: Mostrar estructura del primer pago
        if (pagos.length > 0) {
          console.log('🔍 Estructura del primer pago:', Object.keys(pagos[0]));
          console.log('👤 Campos de usuario disponibles:');
          console.log('   - idUsuario:', pagos[0].idUsuario);
          console.log('   - usuarioId:', (pagos[0] as any).usuarioId);
          console.log('   - userId:', (pagos[0] as any).userId);
          console.log('   - idUser:', (pagos[0] as any).idUser);
          console.log('   - usuario:', (pagos[0] as any).usuario);
        }

        // FILTRAR por usuario - prueba diferentes campos
        const historialFiltrado = pagos.filter(pago => {
          // Prueba todos los posibles nombres de campo
          const idDelUsuario = pago.idUsuario ||
            (pago as any).usuarioId ||
            (pago as any).userId ||
            (pago as any).idUser ||
            (pago as any).usuario?.id;

          console.log(`🔎 Pago ID ${pago.id}: ID Usuario = ${idDelUsuario}, ¿Coincide con ${usuarioId}? ${idDelUsuario == usuarioId}`);

          return idDelUsuario == usuarioId; // Usar == para comparar diferentes tipos
        });

        console.log('✅ Historial filtrado:', historialFiltrado);

        this.historial = historialFiltrado.map(pago => ({
          ...pago,
          fechaPago: this.formatearFecha(pago.fechaPago)
        }));

        this.cargando = false;
      },
      error: (error: any) => {
        console.error('❌ Error al cargar el historial:', error);
        // Datos de ejemplo como fallback
        this.historial = this.getDatosEjemplo();
        this.cargando = false;
      }
    });
  }

  cargarTotalesPorUsuario(): void {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    this.pagoService.totalPorUsuarioEnRango(inicio, fin).subscribe({
      next: (data: ReporteTotalUsuario[]) => {
        this.totalesPorUsuario = data;
        this.calcularEstadisticas();
      },
      error: (error: any) => {
        console.error('Error cargando totales por usuario:', error);
      }
    });
  }

  cargarConteoEstadoMetodo(): void {
    this.pagoService.countPagosPorEstadoYMetodo().subscribe({
      next: (data: ReporteEstadoMetodo[]) => {
        this.conteoEstadoMetodo = data;
      },
      error: (error: any) => {
        console.error('Error cargando conteo estado-metodo:', error);
      }
    });
  }

  cargarIngresosMensuales(): void {
    this.pagoService.ingresosMensualesUltimoAnio().subscribe({
      next: (data: ReporteIngresosMensuales[]) => {
        this.ingresosMensuales = data.map(item => ({
          ...item,
          nombreMes: this.obtenerNombreMes(item.mes)
        }));
      },
      error: (error: any) => {
        console.error('Error cargando ingresos mensuales:', error);
      }
    });
  }

  cargarTopUsuarios(): void {
    this.pagoService.topUsuariosConMasPagos().subscribe({
      next: (data: ReporteTopUsuarios[]) => {
        this.topUsuarios = data;
      },
      error: (error: any) => {
        console.error('Error cargando top usuarios:', error);
      }
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalIngresos = this.totalesPorUsuario.reduce((sum, user) => sum + user.totalPagado, 0);
    this.estadisticas.pagosCompletados = this.conteoEstadoMetodo
      .filter(item => item.estado === 'COMPLETADO')
      .reduce((sum, item) => sum + item.cantidad, 0);
    this.estadisticas.usuariosActivos = this.totalesPorUsuario.length;
    this.estadisticas.ingresoPromedio = this.estadisticas.usuariosActivos > 0
      ? this.estadisticas.totalIngresos / this.estadisticas.usuariosActivos
      : 0;
  }

  cambiarPestana(pestana: string): void {
    this.pestanaActiva = pestana;
  }

  aplicarFiltroFecha(): void {
    this.cargarTotalesPorUsuario();
  }

  // Métodos auxiliares
  private formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  private obtenerNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || 'Desconocido';
  }

  private getDatosEjemplo(): PagoDTO[] {
    // Datos de ejemplo por si falla la carga
    return [
      {
        id: 1,
        fechaPago: '15/04/2024',
        monto: 12.99,
        estado: 'Completado',
        metodoPago: 'Tarjeta',
        idUsuario: 1
      },
      {
        id: 2,
        fechaPago: '15/03/2024',
        monto: 12.99,
        estado: 'Completado',
        metodoPago: 'Tarjeta',
        idUsuario: 1
      },
      {
        id: 3,
        fechaPago: '15/02/2024',
        monto: 12.99,
        estado: 'Rechazado',
        metodoPago: 'PayPal',
        idUsuario: 1
      },
      {
        id: 4,
        fechaPago: '15/01/2024',
        monto: 12.99,
        estado: 'Completado',
        metodoPago: 'Tarjeta',
        idUsuario: 1
      }
    ];
  }

  descargarFacturaGeneral(): void {
    console.log('Descargando factura general...');
    alert('Función para descargar la factura principal.');
  }

  descargarRecibo(pagoId: number): void {
    console.log(`Descargando recibo para el pago: ${pagoId}`);
    alert(`Descargando recibo ${pagoId}...`);
  }

  getClaseEstado(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'completado': case 'completed':
        return 'status-completed';
      case 'rechazado': case 'rejected':
        return 'status-rejected';
      case 'pendiente': case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  // Método para formatear dinero
  formatearDinero(monto: number): string {
    return `€${monto.toFixed(2)}`;
  }
}
