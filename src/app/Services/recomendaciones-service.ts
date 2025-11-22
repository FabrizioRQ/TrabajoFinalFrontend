// Services/recomendaciones.service.ts
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {DiarioEmocionalDTO} from '../../model/DiarioEmocionalDTO';

export interface Recomendacion {
  titulo: string;
  descripcion: string;
  tipo: 'video' | 'articulo' | 'ejercicio' | 'musica' | 'juego';
  categoria: string;
  url?: string;
  duracion?: string;
  icono: string;
}

// Interface para definir las claves válidas
interface RecomendacionesPorEmocion {
  [key: string]: Recomendacion[];
}

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {

  // Base de datos local de recomendaciones por emoción
  private recomendacionesBase: RecomendacionesPorEmocion = {
    TRISTE: [
      {
        titulo: 'Música alegre para levantar el ánimo',
        descripcion: 'Playlist con canciones que te harán sentir mejor',
        tipo: 'musica',
        categoria: 'musica',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
        duracion: '60 min',
        icono: '🎵'
      },
      {
        titulo: 'Ejercicio de gratitud',
        descripcion: 'Escribe 3 cosas por las que estés agradecido hoy',
        tipo: 'ejercicio',
        categoria: 'escritura',
        duracion: '10 min',
        icono: '📝'
      },
      {
        titulo: 'Video de risas',
        descripcion: 'Contenido divertido para mejorar tu estado de ánimo',
        tipo: 'video',
        categoria: 'entretenimiento',
        duracion: '15 min',
        icono: '😊'
      }
    ],
    ANSIOSO: [
      {
        titulo: 'Ejercicio de respiración profunda',
        descripcion: 'Técnica 4-7-8 para calmar la ansiedad al instante',
        tipo: 'ejercicio',
        categoria: 'respiración',
        duracion: '5 min',
        icono: '🌬️'
      },
      {
        titulo: 'Meditación guiada para la ansiedad',
        descripcion: 'Sesión de 10 minutos para encontrar calma',
        tipo: 'video',
        categoria: 'meditación',
        duracion: '10 min',
        icono: '🧘'
      },
      {
        titulo: 'Juego de atención plena',
        descripcion: 'Actividad para enfocar tu mente en el presente',
        tipo: 'juego',
        categoria: 'mindfulness',
        duracion: '8 min',
        icono: '🎯'
      }
    ],
    ENOJADO: [
      {
        titulo: 'Ejercicio de liberación física',
        descripcion: 'Movimientos para liberar la tensión acumulada',
        tipo: 'ejercicio',
        categoria: 'ejercicio',
        duracion: '7 min',
        icono: '💪'
      },
      {
        titulo: 'Técnica de pausa y reflexión',
        descripcion: 'Aprende a tomar un momento antes de reaccionar',
        tipo: 'articulo',
        categoria: 'psicología',
        duracion: '8 min',
        icono: '⏸️'
      },
      {
        titulo: 'Música relajante',
        descripcion: 'Sonidos calmantes para reducir la intensidad emocional',
        tipo: 'musica',
        categoria: 'musica',
        duracion: '20 min',
        icono: '🎵'
      }
    ],
    ESTRESADO: [
      {
        titulo: 'Yoga para principiantes',
        descripcion: 'Rutina suave para liberar el estrés',
        tipo: 'video',
        categoria: 'yoga',
        duracion: '15 min',
        icono: '🧘'
      },
      {
        titulo: 'Ejercicio de relajación muscular',
        descripcion: 'Técnica progresiva para aliviar la tensión',
        tipo: 'ejercicio',
        categoria: 'relajación',
        duracion: '12 min',
        icono: '💆'
      },
      {
        titulo: 'Organización de tareas',
        descripcion: 'Método para manejar tus responsabilidades sin estrés',
        tipo: 'articulo',
        categoria: 'productividad',
        duracion: '10 min',
        icono: '📋'
      }
    ],
    FELIZ: [
      {
        titulo: 'Mantén tu energía positiva',
        descripcion: 'Actividades para prolongar tu buen estado de ánimo',
        tipo: 'articulo',
        categoria: 'bienestar',
        duracion: '6 min',
        icono: '🌟'
      },
      {
        titulo: 'Comparte tu felicidad',
        descripcion: 'Ideas para contagiar tu buen humor a los demás',
        tipo: 'ejercicio',
        categoria: 'social',
        duracion: 'Variable',
        icono: '🤗'
      },
      {
        titulo: 'Playlist para celebrar',
        descripcion: 'Música que combina con tu buen estado de ánimo',
        tipo: 'musica',
        categoria: 'musica',
        duracion: '45 min',
        icono: '🎉'
      }
    ],
    NEUTRAL: [
      {
        titulo: 'Meditación mindfulness',
        descripcion: 'Practica la atención plena en el momento presente',
        tipo: 'video',
        categoria: 'meditación',
        duracion: '10 min',
        icono: '🌿'
      },
      {
        titulo: 'Lectura inspiradora',
        descripcion: 'Artículos para el crecimiento personal',
        tipo: 'articulo',
        categoria: 'desarrollo',
        duracion: '12 min',
        icono: '📚'
      },
      {
        titulo: 'Ejercicio de autoconocimiento',
        descripcion: 'Reflexiona sobre tus metas y sueños',
        tipo: 'ejercicio',
        categoria: 'reflexión',
        duracion: '15 min',
        icono: '💭'
      }
    ]
  };

  constructor(private http: HttpClient) {}

  // Método principal para obtener recomendaciones basadas en el historial emocional
  obtenerRecomendaciones(emociones: DiarioEmocionalDTO[]): Recomendacion[] {
    if (!emociones || emociones.length === 0) {
      return this.getRecomendacionesDefault();
    }

    // Analizar el patrón emocional reciente
    const emocionPredominante = this.analizarPatronEmocional(emociones);

    // Obtener recomendaciones específicas para esa emoción
    const recomendaciones = this.recomendacionesBase[emocionPredominante] ||
      this.recomendacionesBase["NEUTRAL"];

    // Mezclar las recomendaciones para variedad
    return this.mezclarArray([...recomendaciones]).slice(0, 3);
  }

  private analizarPatronEmocional(emociones: DiarioEmocionalDTO[]): string {
    // Tomar las últimas 5 emociones para el análisis
    const emocionesRecientes = emociones.slice(-5);

    // Contar frecuencia de cada emoción
    const frecuencia: {[emocion: string]: number} = {};

    emocionesRecientes.forEach(emocion => {
      const emocionKey = emocion.emocionRegistrada.toUpperCase();
      frecuencia[emocionKey] = (frecuencia[emocionKey] || 0) + 1;
    });

    // Encontrar la emoción más frecuente
    let emocionPredominante = 'NEUTRAL';
    let maxFrecuencia = 0;

    Object.entries(frecuencia).forEach(([emocion, count]) => {
      if (count > maxFrecuencia) {
        maxFrecuencia = count;
        emocionPredominante = emocion;
      }
    });

    // Mapear emociones similares
    const emocionesMap: {[key: string]: string} = {
      'TRISTEZA': 'TRISTE',
      'ANSIEDAD': 'ANSIOSO',
      'ENOJO': 'ENOJADO',
      'ESTRES': 'ESTRESADO',
      'FELICIDAD': 'FELIZ',
      'CALMA': 'NEUTRAL',
      'MIEDO': 'ANSIOSO'
    };

    return emocionesMap[emocionPredominante] || emocionPredominante;
  }

  private getRecomendacionesDefault(): Recomendacion[] {
    const todasRecomendaciones = Object.values(this.recomendacionesBase).flat();
    return this.mezclarArray([...todasRecomendaciones]).slice(0, 3);
  }

  private mezclarArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Método opcional para obtener recomendaciones de IA externa
  obtenerRecomendacionesIA(emocionActual: string): Observable<Recomendacion[]> {
    const emocionKey = emocionActual.toUpperCase();
    const recomendaciones = this.recomendacionesBase[emocionKey] ||
      this.recomendacionesBase["NEUTRAL"];

    return of(this.mezclarArray([...recomendaciones]).slice(0, 3));
  }
}
