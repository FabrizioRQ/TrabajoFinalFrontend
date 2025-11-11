// nino.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NiñoDto } from '../../model/niño-dto.model';

@Injectable({
  providedIn: 'root'
})
export class NinoService {
  private apiUrl = `${environment.apiURL}/niños`;

  constructor(private http: HttpClient) {}

  crearNino(ninoDto: NiñoDto): Observable<NiñoDto> {
    return this.http.post<NiñoDto>(this.apiUrl, ninoDto);
  }

  obtenerNinos(): Observable<NiñoDto[]> {
    return this.http.get<NiñoDto[]>(this.apiUrl);
  }

  obtenerNinoPorId(id: number): Observable<NiñoDto> {
    return this.http.get<NiñoDto>(`${this.apiUrl}/${id}`);
  }

  actualizarNino(id: number, ninoDto: NiñoDto): Observable<NiñoDto> {
    return this.http.put<NiñoDto>(`${this.apiUrl}/${id}`, ninoDto);
  }

  eliminarNino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerNinoPorUsuarioId(usuarioId: number): Observable<NiñoDto> {
    return this.http.get<NiñoDto>(`${this.apiUrl}/por-usuario/${usuarioId}`);
  }

}
