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
  private apiURL = `${environment.apiURL}/auth`;

  constructor(private http: HttpClient) {}

  // LOGIN
  login(loginData: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiURL}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('correoElectronico', response.correoElectronico);
        localStorage.setItem('tipoUsuario', response.tipoUsuario);
        localStorage.setItem('user', JSON.stringify({ role: response.tipoUsuario }));
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('tipoUsuario');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
