// datos.service.ts (servicio para obtener las listas)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AvatarDto } from '../../model/avatar-dto.model';

import { PadreDto } from '../../model/padre-dto.model';
import {PsicologoDTO} from '../../model/psicologo-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  obtenerAvatares(): Observable<AvatarDto[]> {
    return this.http.get<AvatarDto[]>(`${this.apiUrl}/avatares`);
  }

  obtenerPsicologos(): Observable<PsicologoDTO[]> {
    return this.http.get<PsicologoDTO[]>(`${this.apiUrl}/psicologos`);
  }

  obtenerPadres(): Observable<PadreDto[]> {
    return this.http.get<PadreDto[]>(`${this.apiUrl}/padres`);
  }
}
