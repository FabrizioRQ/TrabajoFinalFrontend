// avatar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AvatarDto } from '../../model/avatar-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private apiUrl = `${environment.apiURL}/avatares`;

  constructor(private http: HttpClient) {}

  crearAvatar(avatarDto: AvatarDto): Observable<AvatarDto> {
    return this.http.post<AvatarDto>(this.apiUrl, avatarDto);
  }

  subirImagenAvatar(archivo: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post<{url: string}>(`${this.apiUrl}/upload`, formData);
  }

  obtenerTodosLosAvatares(): Observable<AvatarDto[]> {
    return this.http.get<AvatarDto[]>(this.apiUrl);
  }

  obtenerAvatarPorId(id: number): Observable<AvatarDto> {
    return this.http.get<AvatarDto>(`${this.apiUrl}/${id}`);
  }

  actualizarAvatar(id: number, avatarDto: AvatarDto): Observable<AvatarDto> {
    return this.http.put<AvatarDto>(`${this.apiUrl}/${id}`, avatarDto);
  }

  eliminarAvatar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
