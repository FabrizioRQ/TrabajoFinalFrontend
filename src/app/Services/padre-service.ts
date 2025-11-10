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

  // Crear un nuevo padre
  crearPadre(padreDto: PadreDto): Observable<PadreDto> {
    // Asignar automáticamente el ID del usuario logueado
    const userId = this.authService.getUserId();
    const data = {
      ...padreDto,
      idUsuario: userId
    };

    console.log('📤 Enviando datos al backend:', data);
    return this.http.post<PadreDto>(this.apiUrl, data);
  }

  // Obtener todos los padres (probablemente solo para ADMIN)
  obtenerTodosLosPadres(): Observable<PadreDto[]> {
    return this.http.get<PadreDto[]>(this.apiUrl);
  }

  // Obtener padre por ID
  obtenerPadrePorId(id: number): Observable<PadreDto> {
    return this.http.get<PadreDto>(`${this.apiUrl}/${id}`);
  }

  // Actualizar padre
  actualizarPadre(id: number, padreDto: PadreDto): Observable<PadreDto> {
    return this.http.put<PadreDto>(`${this.apiUrl}/${id}`, padreDto);
  }

  // Eliminar padre
  eliminarPadre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 👇 Obtener los padres del usuario logueado
  obtenerMisPadres(): Observable<PadreDto[]> {
    const userId = this.authService.getUserId();
    // Si tu backend tiene un endpoint específico para esto
    // return this.http.get<PadreDto[]>(`${this.apiUrl}/usuario/${userId}`);

    // Por ahora, obtenemos todos y filtramos en el frontend
    return this.http.get<PadreDto[]>(this.apiUrl);
  }
}
