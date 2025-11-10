// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface UsuarioDTO {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.apiUrl+"/usuarios");
  }
}
