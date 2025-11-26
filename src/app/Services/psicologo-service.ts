import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PsicologoDTO} from '../../model/psicologo-dto.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {

  private apiUrl = `${environment.apiURL}/psicologos`;


  constructor(private http: HttpClient) {}

  registrarPsicologo(psicologo: PsicologoDTO): Observable<PsicologoDTO> {
    return this.http.post<PsicologoDTO>(this.apiUrl, psicologo);
  }

  obtenerPsicologos(): Observable<PsicologoDTO[]> {
    return this.http.get<PsicologoDTO[]>(`${this.apiUrl}`);
  }

  obtenerPsicologoPorId(id: number): Observable<PsicologoDTO> {
    return this.http.get<PsicologoDTO>(`${this.apiUrl}/${id}`);
  }

  buscarPorEspecialidad(especialidad: string): Observable<PsicologoDTO[]> {
    return this.http.get<PsicologoDTO[]>(`${this.apiUrl}/especialidad/${especialidad}`);
  }

  buscarPorNumeroColegiatura(numero: string): Observable<PsicologoDTO> {
    return this.http.get<PsicologoDTO>(`${this.apiUrl}/colegiatura/${numero}`);
  }

  buscarPorNombreYEspecialidad(nombre: string, especialidad?: string): Observable<PsicologoDTO[]> {
    let params = new HttpParams().set('nombre', nombre);
    if (especialidad) {
      params = params.set('especialidad', especialidad);
    }
    return this.http.get<PsicologoDTO[]>(`${this.apiUrl}/buscar`, { params });
  }
}
