// padre.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PadreDto } from '../../model/padre-dto.model';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class PadreService {
  private apiUrl = `${environment.apiURL}/padres`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  crearPadre(padreDto: PadreDto): Observable<PadreDto> {
    const userId = this.authService.getUserId();
    const data = {
      ...padreDto,
      idUsuario: userId
    };

    console.log('📤 Enviando datos al backend:', data);
    return this.http.post<PadreDto>(this.apiUrl, data);
  }

  obtenerTodosLosPadres(): Observable<PadreDto[]> {
    return this.http.get<PadreDto[]>(this.apiUrl);
  }

  obtenerPadrePorId(id: number): Observable<PadreDto> {
    return this.http.get<PadreDto>(`${this.apiUrl}/${id}`);
  }

  actualizarPadre(id: number, padreDto: PadreDto): Observable<PadreDto> {
    return this.http.put<PadreDto>(`${this.apiUrl}/${id}`, padreDto);
  }

  eliminarPadre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerMisPadres(): Observable<PadreDto[]> {
    const userId = this.authService.getUserId();
    return this.http.get<PadreDto[]>(this.apiUrl);
  }

  // 🔹 Nuevos métodos agregados
  buscarPorNombre(nombre: string): Observable<PadreDto[]> {
    return this.http.get<PadreDto[]>(`${this.apiUrl}/buscar/nombre/${nombre}`);
  }

  buscarPorApellidoPrefijo(prefijo: string): Observable<PadreDto[]> {
    return this.http.get<PadreDto[]>(`${this.apiUrl}/buscar/apellido/${prefijo}`);
  }

  reporteCantidadHijos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/reporte/cantidad-hijos`);
  }

  padresConNiñosMenores(): Observable<PadreDto[]> {
    return this.http.get<PadreDto[]>(`${this.apiUrl}/reporte/con-ninos-menores`);
  }
}
