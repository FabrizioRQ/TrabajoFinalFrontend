import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definición de las preguntas posibles
interface Pregunta {
  id: number;
  texto: string;
  tipo: 'escala' | 'texto' | 'multiple';
  opciones?: string[];
}

@Component({
  selector: 'app-registro-emociones',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './registro-emociones.html',
  styleUrl: './registro-emociones.css',
})
export class RegistroEmociones implements OnInit {
  // --- Datos y Estado ---
  titulo: string = '¿Cómo te sentiste hoy?';
  preguntaActual: Pregunta | null = null;
  respuestaUsuario: string | number | null = null;
  registroEnviado: boolean = false;

  // Simulación de las preguntas disponibles
  preguntasDisponibles: Pregunta[] = [
    {
      id: 1,
      texto: "¿Cómo te sentiste hoy en una escala del 1 al 5?",
      tipo: 'escala',
      opciones: ['1 (Muy Mal)', '2', '3 (Neutral)', '4', '5 (Muy Bien)']
    },
    {
      id: 2,
      texto: "¿Qué te hizo sentir así?",
      tipo: 'texto'
    },
    {
      id: 3,
      texto: "¿Qué emoción predominó hoy?",
      tipo: 'multiple',
      opciones: ['Feliz', 'Triste', 'Ansioso', 'Enojado', 'Calmado']
    }
  ];

  // --- Implementación de OnInit ---
  ngOnInit(): void {
    this.cargarPreguntaAleatoria();
  }

  // --- Lógica de Preguntas ---
  cargarPreguntaAleatoria(): void {
    const randomIndex = Math.floor(Math.random() * this.preguntasDisponibles.length);
    this.preguntaActual = this.preguntasDisponibles[randomIndex];
    this.respuestaUsuario = null; // Resetear respuesta
    this.registroEnviado = false;
  }

  // --- Lógica de Registro ---
  registrarEmocion(): void {
    if (this.respuestaUsuario === null || this.respuestaUsuario === '') {
      alert('Por favor, selecciona o ingresa una respuesta.');
      return;
    }

    console.log('--- Registro de Emoción ---');
    console.log('Pregunta:', this.preguntaActual?.texto);
    console.log('Respuesta:', this.respuestaUsuario);

    // Criterio de Aceptación: Si es textual, categorizar implícitamente (simulado)
    if (this.preguntaActual?.tipo === 'texto') {
      console.log('-> Clasificación IA (Simulada): Ansioso');
    }

    // Criterio de Aceptación: Guardar respuesta (simulado)
    // Lógica para sincronizar datos offline y mostrar confirmación (simulado)

    this.registroEnviado = true;
    setTimeout(() => {
      // Simular que el usuario ya respondió (registro idempotente)
      console.log('Registro guardado en historial emocional.');
    }, 500);
  }

  // Cierra el componente (simulando que la notificación se descarta)
  descartar(): void {
    alert('Registro descartado. Vuelve a las 21:00 para la siguiente notificación.');
    // En un caso real, podrías navegar a la página principal.
  }
}
