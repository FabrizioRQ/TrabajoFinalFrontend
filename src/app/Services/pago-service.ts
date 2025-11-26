import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // IMPORTANTE: Agregar este import
import { PagoCreateDTO } from '../../model/pagocreate-dto.model';
import { PagoDTO } from '../../model/pago-dto.model';
import { PlanSuscripcionDTO } from '../../model/plan-suscripcion.dto';
import { SeleccionPlanDTO } from '../../model/selecionarPlan-dto.model';
import { MetodoPagoDTO } from '../../model/MetodoPagoDTO';
import { CrearMetodoPagoDTO } from '../../model/crear-metodo-pago.dto';
import { RespuestaMetodoPagoDTO } from '../../model/respuesta-metodo-pago.dto';
import { RespuestaPlanDTO } from '../../model/RespuestaPlan-dto.model';
import { AuthService } from './auth-service';
import {environment} from '../../environments/environment';

// Interfaces para los reportes
export interface ReporteTotalUsuario {
  nombreCompleto: string;
  totalPagado: number;
}

export interface ReporteEstadoMetodo {
  estado: string;
  metodoPago: string;
  cantidad: number;
}

export interface ReporteIngresosMensuales {
  mes: number;
  totalIngresos: number;
  nombreMes?: string;
}

export interface ReporteTopUsuarios {
  nombreCompleto: string;
  cantidadPagos: number;
  totalPagado: number;
}

// Interfaces para la gestión de suscripciones
export interface CancelacionSuscripcionDTO {
  usuarioId: number;
  motivo: string;
  pausarPagos: boolean;
}

export interface EstadoSuscripcionDTO {
  activa: boolean;
  planActual: string;
  fechaProximoPago: string | null;
  fechaCancelacion: string | null;
  pausada: boolean;
  motivoCancelacion: string | null;
}

export interface RespuestaSimpleDTO {
  exito: boolean;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = `${environment.apiURL}/pagos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsuarioId(): number {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    return userId;
  }

  // --- Métodos existentes de pagos ---
  crearPago(pagoDTO: PagoCreateDTO): Observable<PagoDTO> {
    return this.http.post<PagoDTO>(this.apiUrl, pagoDTO, { headers: this.getHeaders() });
  }

  obtenerPagoPorId(id: number): Observable<PagoDTO> {
    return this.http.get<PagoDTO>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarPagos(): Observable<PagoDTO[]> {
    return this.http.get<PagoDTO[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  listarPagosPorUsuario(usuarioId: number): Observable<PagoDTO[]> {
    return this.http.get<PagoDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  actualizarPago(id: number, pagoDTO: PagoCreateDTO): Observable<PagoDTO> {
    return this.http.put<PagoDTO>(`${this.apiUrl}/${id}`, pagoDTO, { headers: this.getHeaders() });
  }

  eliminarPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // --- Métodos existentes de planes y métodos de pago ---
  obtenerPlanesDisponibles(): Observable<PlanSuscripcionDTO[]> {
    return this.http.get<PlanSuscripcionDTO[]>(`${this.apiUrl}/planes`, { headers: this.getHeaders() });
  }

  seleccionarPlan(seleccionDTO: SeleccionPlanDTO): Observable<RespuestaPlanDTO> {
    return this.http.post<RespuestaPlanDTO>(`${this.apiUrl}/seleccionar-plan`, seleccionDTO, { headers: this.getHeaders() });
  }

  obtenerPlanActual(usuarioId: number): Observable<PlanSuscripcionDTO> {
    return this.http.get<PlanSuscripcionDTO>(`${this.apiUrl}/plan-actual/${usuarioId}`, { headers: this.getHeaders() });
  }

  obtenerMetodosPagoUsuario(usuarioId: number): Observable<MetodoPagoDTO[]> {
    return this.http.get<MetodoPagoDTO[]>(`${this.apiUrl}/metodos-pago/${usuarioId}`, { headers: this.getHeaders() });
  }

  agregarMetodoPago(metodoDTO: CrearMetodoPagoDTO): Observable<RespuestaMetodoPagoDTO> {
    return this.http.post<RespuestaMetodoPagoDTO>(`${this.apiUrl}/metodos-pago`, metodoDTO, { headers: this.getHeaders() });
  }

  eliminarMetodoPago(metodoPagoId: number, usuarioId: number): Observable<RespuestaMetodoPagoDTO> {
    return this.http.delete<RespuestaMetodoPagoDTO>(
      `${this.apiUrl}/metodos-pago/${metodoPagoId}/usuario/${usuarioId}`,
      { headers: this.getHeaders() }
    );
  }

  // --- NUEVOS MÉTODOS PARA REPORTES (CORREGIDOS) ---

  /**
   * 1) Total pagado por usuario en un rango de fechas
   */
  totalPorUsuarioEnRango(inicio: Date, fin: Date): Observable<ReporteTotalUsuario[]> {
    const params = new HttpParams()
      .set('inicio', inicio.toISOString())
      .set('fin', fin.toISOString());

    return this.http.get<any[]>(`${this.apiUrl}/total-rango`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(data => data.map(item => ({
        nombreCompleto: item[0],
        totalPagado: item[1]
      } as ReporteTotalUsuario)))
    );
  }

  /**
   * 2) Conteo de pagos por estado y método
   */
  countPagosPorEstadoYMetodo(): Observable<ReporteEstadoMetodo[]> {
    return this.http.get<any[]>(`${this.apiUrl}/count-estado-metodo`, {
      headers: this.getHeaders()
    }).pipe(
      map(data => data.map(item => ({
        estado: item[0],
        metodoPago: item[1],
        cantidad: item[2]
      } as ReporteEstadoMetodo)))
    );
  }

  /**
   * 3) Reporte ingresos mensuales últimos 12 meses
   */
  ingresosMensualesUltimoAnio(): Observable<ReporteIngresosMensuales[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ingresos-mensuales`, {
      headers: this.getHeaders()
    }).pipe(
      map(data => data.map(item => ({
        mes: item[0],
        totalIngresos: item[1],
        nombreMes: this.obtenerNombreMes(item[0])
      } as ReporteIngresosMensuales)))
    );
  }

  /**
   * 4) Top usuarios con más pagos
   */
  topUsuariosConMasPagos(): Observable<ReporteTopUsuarios[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-usuarios`, {
      headers: this.getHeaders()
    }).pipe(
      map(data => data.map(item => ({
        nombreCompleto: item[0],
        cantidadPagos: item[1],
        totalPagado: item[2]
      } as ReporteTopUsuarios)))
    );
  }

  // Método auxiliar para obtener nombre del mes
  private obtenerNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || 'Desconocido';
  }

  // --- Métodos conveniencia ---
  obtenerMisMetodosPago(): Observable<MetodoPagoDTO[]> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerMetodosPagoUsuario(usuarioId);
  }

  obtenerMiPlanActual(): Observable<PlanSuscripcionDTO> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerPlanActual(usuarioId);
  }

  // --- Métodos para gestión de suscripciones ---
  obtenerEstadoSuscripcion(usuarioId: number): Observable<EstadoSuscripcionDTO> {
    return this.http.get<EstadoSuscripcionDTO>(
      `${this.apiUrl}/estado-suscripcion/${usuarioId}`,
      { headers: this.getHeaders() }
    );
  }

  pausarSuscripcion(cancelacionDTO: CancelacionSuscripcionDTO): Observable<RespuestaSimpleDTO> {
    return this.http.post<RespuestaSimpleDTO>(
      `${this.apiUrl}/pausar-suscripcion`,
      cancelacionDTO,
      { headers: this.getHeaders() }
    );
  }

  cancelarSuscripcion(cancelacionDTO: CancelacionSuscripcionDTO): Observable<RespuestaSimpleDTO> {
    return this.http.post<RespuestaSimpleDTO>(
      `${this.apiUrl}/cancelar-suscripcion`,
      cancelacionDTO,
      { headers: this.getHeaders() }
    );
  }

  reactivarSuscripcion(usuarioId: number): Observable<RespuestaSimpleDTO> {
    return this.http.post<RespuestaSimpleDTO>(
      `${this.apiUrl}/reactivar-suscripcion/${usuarioId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // --- Métodos conveniencia para gestión de suscripciones ---
  obtenerMiEstadoSuscripcion(): Observable<EstadoSuscripcionDTO> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerEstadoSuscripcion(usuarioId);
  }

  pausarMiSuscripcion(motivo: string, pausarPagos: boolean): Observable<RespuestaSimpleDTO> {
    const usuarioId = this.getUsuarioId();
    const cancelacionDTO: CancelacionSuscripcionDTO = {
      usuarioId: usuarioId,
      motivo: motivo,
      pausarPagos: pausarPagos
    };
    return this.pausarSuscripcion(cancelacionDTO);
  }

  cancelarMiSuscripcion(motivo: string): Observable<RespuestaSimpleDTO> {
    const usuarioId = this.getUsuarioId();
    const cancelacionDTO: CancelacionSuscripcionDTO = {
      usuarioId: usuarioId,
      motivo: motivo,
      pausarPagos: false
    };
    return this.cancelarSuscripcion(cancelacionDTO);
  }

  reactivarMiSuscripcion(): Observable<RespuestaSimpleDTO> {
    const usuarioId = this.getUsuarioId();
    return this.reactivarSuscripcion(usuarioId);
  }
}
