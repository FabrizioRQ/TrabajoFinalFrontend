import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PsicologoDTO} from '../../model/psicologo-dto.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {
  private apiUrl = 'http://localhost:8080/api/psicologos';

  constructor(private http: HttpClient) {}

  registrarPsicologo(psicologo: PsicologoDTO): Observable<PsicologoDTO> {
    return this.http.post<PsicologoDTO>(this.apiUrl, psicologo);
  }

  obtenerPsicologoPorId(id: number): Observable<PsicologoDTO> {
    return this.http.get<PsicologoDTO>(`${this.apiUrl}/${id}`);
  }

  listarPsicologos(): Observable<PsicologoDTO[]> {
    return this.http.get<PsicologoDTO[]>(this.apiUrl);
  }
}
