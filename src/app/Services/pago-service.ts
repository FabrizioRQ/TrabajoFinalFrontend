import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoCreateDTO } from '../../model/pagocreate-dto.model';
import { PagoDTO } from '../../model/pago-dto.model';
import { PlanSuscripcionDTO } from '../../model/plan-suscripcion.dto';
import { SeleccionPlanDTO } from '../../model/selecionarPlan-dto.model';
import { MetodoPagoDTO } from '../../model/MetodoPagoDTO';
import { CrearMetodoPagoDTO } from '../../model/crear-metodo-pago.dto';
import { RespuestaMetodoPagoDTO } from '../../model/respuesta-metodo-pago.dto';
import { RespuestaPlanDTO } from '../../model/RespuestaPlan-dto.model';
import { AuthService } from './auth-service';

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
  private apiUrl = 'http://localhost:8080/api/pagos';

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

  private getUsuarioId(): number {
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

  // --- Métodos conveniencia ---
  obtenerMisMetodosPago(): Observable<MetodoPagoDTO[]> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerMetodosPagoUsuario(usuarioId);
  }

  obtenerMiPlanActual(): Observable<PlanSuscripcionDTO> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerPlanActual(usuarioId);
  }

  // --- NUEVOS MÉTODOS PARA GESTIÓN DE SUSCRIPCIONES ---

  /**
   * Obtiene el estado actual de la suscripción del usuario
   */
  obtenerEstadoSuscripcion(usuarioId: number): Observable<EstadoSuscripcionDTO> {
    return this.http.get<EstadoSuscripcionDTO>(
      `${this.apiUrl}/estado-suscripcion/${usuarioId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Pausa temporalmente la suscripción
   */
  pausarSuscripcion(cancelacionDTO: CancelacionSuscripcionDTO): Observable<RespuestaSimpleDTO> {
    return this.http.post<RespuestaSimpleDTO>(
      `${this.apiUrl}/pausar-suscripcion`,
      cancelacionDTO,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Cancela permanentemente la suscripción
   */
  cancelarSuscripcion(cancelacionDTO: CancelacionSuscripcionDTO): Observable<RespuestaSimpleDTO> {
    return this.http.post<RespuestaSimpleDTO>(
      `${this.apiUrl}/cancelar-suscripcion`,
      cancelacionDTO,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Reactiva una suscripción previamente pausada
   */
  reactivarSuscripcion(usuarioId: number): Observable<RespuestaSimpleDTO> {
    return this.http.post<RespuestaSimpleDTO>(
      `${this.apiUrl}/reactivar-suscripcion/${usuarioId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // --- Métodos conveniencia para gestión de suscripciones ---

  /**
   * Obtiene el estado de suscripción del usuario actual
   */
  obtenerMiEstadoSuscripcion(): Observable<EstadoSuscripcionDTO> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerEstadoSuscripcion(usuarioId);
  }

  /**
   * Pausa la suscripción del usuario actual
   */
  pausarMiSuscripcion(motivo: string, pausarPagos: boolean): Observable<RespuestaSimpleDTO> {
    const usuarioId = this.getUsuarioId();
    const cancelacionDTO: CancelacionSuscripcionDTO = {
      usuarioId: usuarioId,
      motivo: motivo,
      pausarPagos: pausarPagos
    };
    return this.pausarSuscripcion(cancelacionDTO);
  }

  /**
   * Cancela permanentemente la suscripción del usuario actual
   */
  cancelarMiSuscripcion(motivo: string): Observable<RespuestaSimpleDTO> {
    const usuarioId = this.getUsuarioId();
    const cancelacionDTO: CancelacionSuscripcionDTO = {
      usuarioId: usuarioId,
      motivo: motivo,
      pausarPagos: false
    };
    return this.cancelarSuscripcion(cancelacionDTO);
  }

  /**
   * Reactiva la suscripción del usuario actual
   */
  reactivarMiSuscripcion(): Observable<RespuestaSimpleDTO> {
    const usuarioId = this.getUsuarioId();
    return this.reactivarSuscripcion(usuarioId);
  }
}
