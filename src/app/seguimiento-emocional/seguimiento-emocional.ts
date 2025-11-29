import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth-service';
import {
  DiarioEmocionalNuevo,
  PreguntaEmocionalDTO,
  RegistroEmocionalDTO,
  RespuestaEmocionalDTO
} from '../Services/diario-emocional-nuevo';

interface EmotionItem {
  question: string;
  answer: string;
  tag: 'success' | 'support' | 'warning' | 'error';
  label: string;
  tipo: string;
  id?: number;
}

@Component({
  selector: 'app-seguimiento-emocional',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguimiento-emocional.html',
  styleUrl: './seguimiento-emocional.css',
})
export class SeguimientoEmocional implements OnInit {
  // Estados del componente
  emociones: EmotionItem[] = [];
  preguntasDelDia: PreguntaEmocionalDTO[] = [];
  respuestasUsuario: { [key: number]: string } = {};
  emocionesUsuario: { [key: number]: string } = {};

  // Estados de UI
  cargando = false;
  enviandoRespuestas = false;
  mostrarFormulario = true;
  resultadoProcesado: RespuestaEmocionalDTO | null = null;

  // Datos del niño (en un caso real, esto vendría de un servicio de usuarios)
  niñoId: number = 1; // Puedes obtenerlo del AuthService o de parámetros

  constructor(
    private diarioService: DiarioEmocionalNuevo,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPreguntasDelDia();
  }

  // Cargar preguntas diarias desde el backend
  cargarPreguntasDelDia(): void {
    this.cargando = true;

    this.diarioService.generarPreguntasDiarias(this.niñoId).subscribe({
      next: (preguntas: PreguntaEmocionalDTO[]) => {
        this.preguntasDelDia = preguntas;
        this.inicializarRespuestas();
        this.cargando = false;
        console.log('Preguntas cargadas:', preguntas);
      },
      error: (error) => {
        console.error('Error cargando preguntas:', error);
        this.usarPreguntasPorDefecto();
        this.cargando = false;
      }
    });
  }

  // Inicializar respuestas vacías
  inicializarRespuestas(): void {
    this.preguntasDelDia.forEach(pregunta => {
      this.respuestasUsuario[pregunta.id || 0] = '';
      this.emocionesUsuario[pregunta.id || 0] = 'neutral';
    });
  }

  // Preguntas por defecto en caso de error
  usarPreguntasPorDefecto(): void {
    this.preguntasDelDia = [
      {
        id: 1,
        pregunta: '¿Cómo te sentiste hoy?',
        tipo: 'emocion'
      },
      {
        id: 2,
        pregunta: '¿Qué te hizo sentir así?',
        tipo: 'texto'
      },
      {
        id: 3,
        pregunta: '¿Hubo algo especial que quisieras compartir?',
        tipo: 'texto'
      }
    ];
    this.inicializarRespuestas();
  }

  // Enviar todas las respuestas
  enviarRespuestas(): void {
    if (this.validarRespuestas()) {
      this.enviandoRespuestas = true;

      // Preparar el registro emocional
      const registro: RegistroEmocionalDTO = {
        niñoId: this.niñoId,
        emocion: this.obtenerEmocionPrincipal(),
        contexto: this.obtenerContextoCompleto(),
        escalaEmocional: this.calcularEscalaEmocional(),
        respuestaTexto: this.obtenerRespuestasTexto(),
        fecha: new Date().toISOString().split('T')[0]
      };

      console.log('Enviando registro:', registro);

      this.diarioService.procesarRespuesta(registro).subscribe({
        next: (respuesta: RespuestaEmocionalDTO) => {
          this.resultadoProcesado = respuesta;
          this.mostrarFormulario = false;
          this.procesarResultado(respuesta);
          this.enviandoRespuestas = false;
        },
        error: (error) => {
          console.error('Error enviando respuestas:', error);
          this.mostrarResultadoError();
          this.enviandoRespuestas = false;
        }
      });
    }
  }

  // Procesar el resultado exitoso
  procesarResultado(respuesta: RespuestaEmocionalDTO): void {
    // Convertir las preguntas y respuestas en emociones para mostrar
    this.emociones = this.preguntasDelDia.map((pregunta, index) => {
      const respuestaTexto = this.respuestasUsuario[pregunta.id || 0];
      const emocion = this.emocionesUsuario[pregunta.id || 0];

      return {
        question: pregunta.pregunta,
        answer: respuestaTexto || 'No respondió',
        tag: this.obtenerTagPorEmocion(emocion),
        label: this.formatearEmocion(emocion),
        tipo: pregunta.tipo
      };
    });

    // Agregar la emoción detectada por IA si está disponible
    if (respuesta.emocionDetectada) {
      this.emociones.push({
        question: 'Análisis de tus emociones',
        answer: respuesta.recomendacion || 'Gracias por compartir tus sentimientos',
        tag: respuesta.esCritico ? 'warning' : 'success',
        label: respuesta.emocionDetectada,
        tipo: 'analisis'
      });
    }
  }

  // Mostrar resultado de error
  mostrarResultadoError(): void {
    this.emociones = [{
      question: 'Error de conexión',
      answer: 'Tus respuestas se guardaron localmente y se sincronizarán cuando haya conexión.',
      tag: 'warning',
      label: 'Pendiente',
      tipo: 'error'
    }];
    this.mostrarFormulario = false;
  }

  // Métodos auxiliares
  validarRespuestas(): boolean {
    return this.preguntasDelDia.some(pregunta => {
      const respuesta = this.respuestasUsuario[pregunta.id || 0];
      return respuesta && respuesta.trim().length > 0;
    });
  }

  obtenerEmocionPrincipal(): string {
    const emociones = Object.values(this.emocionesUsuario);
    const emocionFrecuente = emociones.reduce((acc, emocion) => {
      acc[emocion] = (acc[emocion] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(emocionFrecuente).reduce((a, b) =>
      emocionFrecuente[a] > emocionFrecuente[b] ? a : b
    );
  }

  obtenerContextoCompleto(): string {
    return this.preguntasDelDia.map(pregunta =>
      `${pregunta.pregunta}: ${this.respuestasUsuario[pregunta.id || 0]}`
    ).join(' | ');
  }

  calcularEscalaEmocional(): number {
    const emocionPrincipal = this.obtenerEmocionPrincipal();
    const escalas: { [key: string]: number } = {
      'muy-feliz': 5, 'feliz': 4, 'neutral': 3, 'triste': 2, 'muy-triste': 1,
      'ansioso': 2, 'enojado': 1, 'emocionado': 5, 'relajado': 4
    };
    return escalas[emocionPrincipal] || 3;
  }

  obtenerRespuestasTexto(): string {
    return Object.values(this.respuestasUsuario)
      .filter(respuesta => respuesta && respuesta.trim().length > 0)
      .join('. ');
  }

  obtenerTagPorEmocion(emocion: string): 'success' | 'support' | 'warning' | 'error' {
    const tags: { [key: string]: 'success' | 'support' | 'warning' | 'error' } = {
      'muy-feliz': 'success', 'feliz': 'success', 'emocionado': 'success',
      'neutral': 'support', 'relajado': 'support',
      'ansioso': 'warning', 'preocupado': 'warning',
      'triste': 'error', 'muy-triste': 'error', 'enojado': 'error'
    };
    return tags[emocion] || 'support';
  }

  formatearEmocion(emocion: string): string {
    const emocionesFormateadas: { [key: string]: string } = {
      'muy-feliz': 'Muy Feliz', 'feliz': 'Feliz', 'neutral': 'Neutral',
      'triste': 'Triste', 'muy-triste': 'Muy Triste', 'ansioso': 'Ansioso',
      'enojado': 'Enojado', 'emocionado': 'Emocionado', 'relajado': 'Relajado'
    };
    return emocionesFormateadas[emocion] || emocion;
  }

  // Reiniciar el formulario
  reiniciarFormulario(): void {
    this.mostrarFormulario = true;
    this.resultadoProcesado = null;
    this.emociones = [];
    this.inicializarRespuestas();
  }

  // Obtener clase CSS para la emoción
  getEmotionClass(emocion: string): string {
    return `emotion-${emocion}`;
  }
}
