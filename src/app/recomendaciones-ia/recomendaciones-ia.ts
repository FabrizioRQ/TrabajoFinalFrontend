// recomendaciones-ia.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NinoService } from '../Services/nino-service';
import { AuthService } from '../Services/auth-service';
import { Recomendacion, RecomendacionesService } from '../Services/recomendaciones-service';
import { DiarioService } from '../Services/diario-service';
import {DiarioEmocionalDTO} from '../../model/DiarioEmocionalDTO';


@Component({
  selector: 'app-recomendaciones-ia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones-ia.html',
  styleUrls: ['./recomendaciones-ia.css']
})
export class RecomendacionesIa implements OnInit {
  recomendaciones: Recomendacion[] = [];
  cargando: boolean = true;
  emocionPredominante: string = '';
  ultimaActualizacion: string = '';

  constructor(
    private recomendacionesService: RecomendacionesService,
    private diarioService: DiarioService,
    private ninoService: NinoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones([]);
      this.cargando = false;
      return;
    }

    this.ninoService.obtenerNinoPorUsuarioId(userId).subscribe({
      next: (nino) => {
        if (nino && nino.id) {
          this.diarioService.getEmocionesByNiñoId(nino.id).subscribe({
            next: (emociones: DiarioEmocionalDTO[]) => { // Agregar tipo aquí
              this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones(emociones);
              this.emocionPredominante = this.obtenerEmocionPredominante(emociones);
              this.ultimaActualizacion = new Date().toLocaleTimeString('es-ES');
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error cargando emociones:', error);
              this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones([]);
              this.cargando = false;
            }
          });
        } else {
          this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones([]);
          this.cargando = false;
        }
      },
      error: (error) => {
        console.error('Error cargando niño:', error);
        this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones([]);
        this.cargando = false;
      }
    });
  }

  private obtenerEmocionPredominante(emociones: DiarioEmocionalDTO[]): string { // Agregar tipo aquí
    if (!emociones || emociones.length === 0) return 'neutral';

    const ultimaEmocion = emociones[emociones.length - 1].emocionRegistrada;
    const emocionesMap: {[key: string]: string} = {
      'TRISTE': 'tristeza',
      'ANSIOSO': 'ansiedad',
      'ENOJADO': 'enojo',
      'ESTRESADO': 'estrés',
      'FELIZ': 'felicidad',
      'NEUTRAL': 'calma',
      'TRISTEZA': 'tristeza', // Agregar mapeos adicionales
      'ANSIEDAD': 'ansiedad',
      'ENOJO': 'enojo',
      'ESTRES': 'estrés',
      'FELICIDAD': 'felicidad'
    };

    return emocionesMap[ultimaEmocion.toUpperCase()] || ultimaEmocion.toLowerCase();
  }

  actualizarRecomendaciones(): void {
    this.cargando = true;
    this.cargarRecomendaciones();
  }

  trackByRecomendacion(index: number, recomendacion: Recomendacion): string {
    return recomendacion.titulo + index;
  }
}
