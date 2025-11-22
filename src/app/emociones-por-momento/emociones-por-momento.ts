// emociones-por-momento.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NinoService } from '../Services/nino-service';
import { AuthService } from '../Services/auth-service';
import {DiarioEmocionalDTO} from '../../model/DiarioEmocionalDTO';
import {DiarioService} from '../Services/diario-service';

@Component({
  selector: 'app-emociones-por-momento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emociones-por-momento.html',
  styleUrls: ['./emociones-por-momento.css']
})
export class EmocionesPorMomento implements OnInit {
  title = 'Historial de Emociones Registradas';
  subtitle = 'Seguimiento de tu estado emocional a lo largo del tiempo';

  emociones: DiarioEmocionalDTO[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private diarioService: DiarioService,
    private ninoService: NinoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEmociones();
  }

  cargarEmociones(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.error = 'No se pudo identificar al usuario';
      this.cargando = false;
      return;
    }

    this.ninoService.obtenerNinoPorUsuarioId(userId).subscribe({
      next: (nino) => {
        if (nino && nino.id) {
          this.diarioService.getEmocionesByNiñoId(nino.id).subscribe({
            next: (emociones) => {
              this.emociones = emociones;
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error cargando emociones:', error);
              this.error = 'Error al cargar el historial de emociones';
              this.cargando = false;
            }
          });
        } else {
          this.error = 'No se encontró un perfil de niño asociado';
          this.cargando = false;
        }
      },
      error: (error) => {
        console.error('Error cargando niño:', error);
        this.error = 'Error al cargar la información del niño';
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getClaseEmocion(emocion: string): string {
    const clases: {[key: string]: string} = {
      'FELIZ': 'mood--happy',
      'TRISTE': 'mood--sad',
      'ENOJADO': 'mood--angry',
      'ANSIOSO': 'mood--anxious',
      'ESTRESADO': 'mood--stressed',
      'CALMADO': 'mood--calm',
      'NEUTRAL': 'mood--neutral',
      'MIEDO': 'mood--fear'
    };

    return clases[emocion.toUpperCase()] || 'mood--neutral';
  }

  getIconoEmocion(emocion: string): string {
    const iconos: {[key: string]: string} = {
      'FELIZ': '😊',
      'TRISTE': '😢',
      'ENOJADO': '😠',
      'ANSIOSO': '😰',
      'ESTRESADO': '😫',
      'CALMADO': '😌',
      'NEUTRAL': '😐',
      'MIEDO': '😨'
    };

    return iconos[emocion.toUpperCase()] || '😐';
  }
}
