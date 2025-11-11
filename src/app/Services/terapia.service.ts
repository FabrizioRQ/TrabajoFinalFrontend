// terapia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalisisEmocional {
  emocionDetectada: string;
  confianza: number;
  recomendacion: string;
  critico: boolean;
  timestamp: string;
  mensaje?: string;
}

export interface MensajeChat {
  texto: string;
  esUsuario: boolean;
  emocion?: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TerapiaService {
  private apiUrl = `${environment.apiURL}/terapia`;

  constructor(private http: HttpClient) {}

  analizarEmocion(texto: string, niñoId: number): Observable<AnalisisEmocional> {
    return this.http.post<AnalisisEmocional>(`${this.apiUrl}/analizar-emocion`, {
      texto,
      niñoId
    });
  }

  obtenerHistorialEmocional(niñoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial-emocional/${niñoId}`);
  }

  obtenerUltimasEmociones(niñoId: number, limite: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimas-emociones/${niñoId}?limite=${limite}`);
  }
}
