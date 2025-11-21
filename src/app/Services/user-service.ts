// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuarios`);
  }

  obtenerPorRol(rol: string): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuarios/por-rol/${rol}`);
  }

  buscarPorInicioNombre(texto: string): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuarios/nombre/inicia/${texto}`);
  }

  listarPsicologos(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuarios/psicologos`);
  }

  busquedaAvanzada(params: {[key:string]: any}): Observable<UsuarioDTO[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const val = params[key];
      if (val !== null && val !== undefined && String(val).length > 0) {
        httpParams = httpParams.set(key, String(val));
      }
    });
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuarios/busqueda-avanzada`, { params: httpParams });
  }


  obtenerMiPerfil(): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/usuarios/mi-perfil`);
  }

  actualizarMiPerfil(usuarioDTO: UsuarioDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/mi-perfil`, usuarioDTO);
  }

}
