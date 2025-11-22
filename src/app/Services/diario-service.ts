// Services/diario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import {DiarioEmocionalDTO} from '../../model/DiarioEmocionalDTO';

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  private apiUrl = `${environment.apiURL}/diario-emocional`;

  constructor(private http: HttpClient) { }

  getEmocionesByNiñoId(niñoId: number): Observable<DiarioEmocionalDTO[]> {
    return this.http.get<DiarioEmocionalDTO[]>(`${this.apiUrl}/niño/${niñoId}`);
  }
}
