import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {LoginRequest} from '../../model/login-request.model';

interface JwtResponse {
  token: string;
  tipo: string;
  correoElectronico: string;
  tipoUsuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = `${environment.apiURL}/auth`; // Ajusta según tu endpoint real (ej. /api/auth/login)

  constructor(private http: HttpClient) {}

  // LOGIN
  login(loginData: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiURL}/login`, loginData).pipe(
      tap(response => {
        // Guarda token y datos del usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('correoElectronico', response.correoElectronico);
        localStorage.setItem('tipoUsuario', response.tipoUsuario);
      })
    );
  }

  // LOGOUT
  logout(): void {
    localStorage.clear();
  }

  // VERIFICAR SI ESTÁ LOGUEADO
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // OBTENER ROL DEL USUARIO
  getUserRole(): string | null {
    return localStorage.getItem('tipoUsuario');
  }

  // OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
