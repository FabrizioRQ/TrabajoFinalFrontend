import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth-service';
import {Observable} from 'rxjs';


export interface PreguntaEmocionalDTO {
  id?: number;
  pregunta: string;
  tipo: string;
  opciones?: string[];
}

export interface RegistroEmocionalDTO {
  niñoId: number;
  emocion: string;
  contexto: string;
  escalaEmocional: number;
  respuestaTexto: string;
  fecha: string;
}

export interface RespuestaEmocionalDTO {
  exito: boolean;
  mensaje: string;
  emocionDetectada: string;
  recomendacion: string;
  esCritico: boolean;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiarioEmocionalNuevo {
  private apiUrl = `${environment.apiURL}/diario-emocional`;

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


  generarPreguntasDiarias(niñoId: number): Observable<PreguntaEmocionalDTO[]> {
    return this.http.get<PreguntaEmocionalDTO[]>(
      `${this.apiUrl}/preguntas-diarias/${niñoId}`,
      { headers: this.getHeaders() }
    );
  }

  // Procesar respuesta emocional
  procesarRespuesta(registro: RegistroEmocionalDTO): Observable<RespuestaEmocionalDTO> {
    return this.http.post<RespuestaEmocionalDTO>(
      `${this.apiUrl}/procesar-respuesta`,
      registro,
      { headers: this.getHeaders() }
    );
  }

  // Obtener historial emocional
  obtenerHistorialEmocional(niñoId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/historial/${niñoId}`,
      { headers: this.getHeaders() }
    );
  }


  obtenerEstadisticasEmocionales(niñoId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/estadisticas/${niñoId}`,
      { headers: this.getHeaders() }
    );
  }
}
