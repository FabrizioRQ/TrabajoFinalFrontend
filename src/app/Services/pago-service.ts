import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PagoCreateDTO} from '../../model/pagocreate-dto.model';
import {PagoDTO} from '../../model/pago-dto.model';
import {PlanSuscripcionDTO} from '../../model/plan-suscripcion.dto';
import {SeleccionPlanDTO} from '../../model/selecionarPlan-dto.model';
import {MetodoPagoDTO} from '../../model/MetodoPagoDTO';
import {CrearMetodoPagoDTO} from '../../model/crear-metodo-pago.dto';
import {RespuestaMetodoPagoDTO} from '../../model/respuesta-metodo-pago.dto';
import {RespuestaPlanDTO} from '../../model/RespuestaPlan-dto.model';
import {AuthService} from './auth-service';


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

  // Métodos para Pagos
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

  // Métodos para Planes de Suscripción
  obtenerPlanesDisponibles(): Observable<PlanSuscripcionDTO[]> {
    return this.http.get<PlanSuscripcionDTO[]>(`${this.apiUrl}/planes`, { headers: this.getHeaders() });
  }

  seleccionarPlan(seleccionDTO: SeleccionPlanDTO): Observable<RespuestaPlanDTO> {
    return this.http.post<RespuestaPlanDTO>(`${this.apiUrl}/seleccionar-plan`, seleccionDTO, { headers: this.getHeaders() });
  }

  obtenerPlanActual(usuarioId: number): Observable<PlanSuscripcionDTO> {
    return this.http.get<PlanSuscripcionDTO>(`${this.apiUrl}/plan-actual/${usuarioId}`, { headers: this.getHeaders() });
  }

  // Métodos para Métodos de Pago
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

  // Método para obtener métodos de pago del usuario actual
  obtenerMisMetodosPago(): Observable<MetodoPagoDTO[]> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerMetodosPagoUsuario(usuarioId);
  }

  // Método para obtener plan actual del usuario actual
  obtenerMiPlanActual(): Observable<PlanSuscripcionDTO> {
    const usuarioId = this.getUsuarioId();
    return this.obtenerPlanActual(usuarioId);
  }
}
