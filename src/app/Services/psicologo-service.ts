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

  obtenerPsicologos(): Observable<PsicologoDTO[]> {
    return this.http.get<PsicologoDTO[]>(`${this.apiUrl}`);
  }
}
