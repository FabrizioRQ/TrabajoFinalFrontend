import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalisisEmocional, MensajeChat, TerapiaService } from '../Services/terapia.service';
import { NinoService } from '../Services/nino-service';
import { AuthService } from '../Services/auth-service';
import {NiñoDto} from '../../model/niño-dto.model';

@Component({
  selector: 'app-monitoreo-emocional',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoreo-emocional.html',
  styleUrls: ['./monitoreo-emocional.css']
})
export class MonitoreoEmocional implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  // Estado del chat
  mensajes: MensajeChat[] = [];
  mensajeActual: string = '';
  enviando: boolean = false;

  tecnicasPorEmocion: any = {
    'ESTRES': 'Respira profundo 4 segundos, sostén 4, y suelta 6. Repite 5 veces. Es como reiniciar tu cerebro pero sin romper nada.',
    'ANSIEDAD': 'Cuenta 5 cosas que ves, 4 que puedes tocar, 3 que puedes escuchar, 2 que puedes oler y 1 que puedes saborear. Técnica 5-4-3-2-1.',
    'TRISTEZA': 'Abraza un peluche o almohada durante 20 segundos. Tu cuerpo libera oxitocina aunque el peluche no te abrace de vuelta.',
    'ENOJO': 'Aprieta tus manos fuerte 5 segundos y suelta. Repite 3 veces. Es como exprimir un limón… pero emocional.',
    'MIEDO': 'Imagina una luz protectora alrededor tuyo. Literalmente eres un Gokú emocional.',
    'FELICIDAD': 'Guarda este momento pensando en: “¿Qué lo causó?”. Así fortaleces recuerdos positivos.',
    'CALMA': 'Respiración lenta mientras mueves los hombros suavemente. Una mini siesta para tus músculos.',
    'NEUTRAL': 'Haz 3 respiraciones profundas para equilibrarte.',
    'CRITICO': 'Coloca tu mano en el pecho, respira profundo y busca un adulto de confianza. No tienes que manejar esto solo.'
  };

  // Datos del nino - automático
  ninoActual: NiñoDto | null = null;
  usuarioActual: any = null;

  // Estado emocional actual
  emocionActual: string = 'NEUTRAL';
  confianzaActual: number = 0;
  modoCritico: boolean = false;
  ultimaTecnica: string = '';

  constructor(
    private terapiaService: TerapiaService,
    private ninoService: NinoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.inicializarChat();
    this.cargarNinoActual(); // 👈 Carga el niño del usuario actual
  }

  inicializarChat(): void {
    this.mensajes = [{
      texto: 'Hola, ¿cómo te sientes hoy?',
      esUsuario: false,
      timestamp: new Date()
    }];
  }

  userId: number | null = null;


  cargarNinoActual(): void {


    this.userId = this.authService.getUserId();

    const userId = this.authService.getUserId();

    if (!userId) {
      this.mostrarError('No se pudo identificar al usuario');
      return;
    }

    this.ninoService.obtenerNinoPorUsuarioId(userId).subscribe({
      next: (nino) => {
        this.ninoActual = nino;
        console.log('👶 Niño cargado:', this.ninoActual);
      },
      error: (error) => {
        console.error('❌ Error cargando niño:', error);
        if (error.status === 404) {
          this.mostrarError('No se encontró un perfil de niño asociado a tu usuario');
        } else {
          this.mostrarError('Error al cargar la información del niño');
        }
      }
    });
  }

  async enviarMensaje(): Promise<void> {
    if (!this.mensajeActual.trim() || !this.ninoActual || this.enviando) {
      if (!this.ninoActual) {
        this.mostrarError('No hay un niño asociado para el análisis');
      }
      return;
    }

    const texto = this.mensajeActual.trim();

    this.agregarMensaje(texto, true);
    this.mensajeActual = '';
    this.enviando = true;

    try {
      const analisis = await this.terapiaService.analizarEmocion(
        texto,
        this.ninoActual.id!
      ).toPromise();

      if (analisis) {
        this.procesarAnalisis(analisis, texto);
      }
    } catch (error) {
      console.error('Error analizando emoción:', error);
      this.agregarMensaje('Lo siento, hubo un error al procesar tu mensaje. Intenta nuevamente.', false);
    } finally {
      this.enviando = false;
    }
  }

  private procesarAnalisis(analisis: AnalisisEmocional, textoOriginal: string): void {
    this.emocionActual = analisis.emocionDetectada;
    this.confianzaActual = analisis.confianza;
    this.modoCritico = analisis.critico;


    if (analisis.critico) {
      this.agregarMensajeCritico(analisis);
    } else if (analisis.mensaje) {
      this.agregarMensaje(analisis.mensaje, false, analisis.emocionDetectada);

      if (analisis.emocionDetectada !== 'NEUTRAL') {
        setTimeout(() => {
          this.agregarMensaje(
            `¿Te gustaría probar esta técnica?: "${analisis.recomendacion}"`,
            false,
            analisis.emocionDetectada
          );
        }, 1000);
      }
    } else {
      this.agregarMensaje(analisis.recomendacion, false, analisis.emocionDetectada);
    }
  }

  private agregarMensajeCritico(analisis: AnalisisEmocional): void {
    const mensajeCritico = `🚨 ${analisis.recomendacion} Es importante que contactes a un profesional de inmediato.`;
    this.agregarMensaje(mensajeCritico, false, 'CRITICO');

    setTimeout(() => {
      this.agregarMensaje(
        'Recuerda que hay personas que se preocupan por ti. No estás solo/a. ' +
        'Puedes contactar a tu psicólogo asignado o llamar a una línea de ayuda.',
        false,
        'CRITICO'
      );
    }, 1500);
  }

  private agregarMensaje(texto: string, esUsuario: boolean, emocion?: string): void {
    this.mensajes.push({
      texto,
      esUsuario,
      emocion,
      timestamp: new Date()
    });

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling chat:', err);
    }
  }

  private mostrarError(mensaje: string): void {
    this.agregarMensaje(`⚠️ ${mensaje}`, false);
  }

  aceptarTecnica(): void {
    this.agregarMensaje('Sí, me gustaría probar la técnica', true);

    setTimeout(() => {
      const tecnica = this.tecnicasPorEmocion[this.emocionActual]
        || 'Vamos a respirar juntos un momento. Inhala… exhala… tú puedes.';

      this.agregarMensaje(
        `✨ Aquí tienes una técnica que puede ayudarte:\n\n${tecnica}\n\nCuando estés listo/a, puedes contarme cómo te fue 💛`,
        false,
        this.emocionActual
      );
    }, 900);
  }

  rechazarTecnica(): void {
    this.agregarMensaje('Prefiero no hacerlo ahora', true);

    setTimeout(() => {
      this.agregarMensaje(
        'Está bien. Recuerda que puedes intentarlo cuando te sientas preparado/a. ¿Hay algo más en lo que pueda ayudarte?',
        false
      );
    }, 1000);
  }

  getClaseEmocion(emocion: string | undefined): string {
    if (!emocion) return '';

    const clases = {
      'ESTRES': 'emocion-estres',
      'ANSIEDAD': 'emocion-ansiedad',
      'TRISTEZA': 'emocion-tristeza',
      'ENOJO': 'emocion-enojo',
      'MIEDO': 'emocion-miedo',
      'FELICIDAD': 'emocion-felicidad',
      'CALMA': 'emocion-calma',
      'CRITICO': 'emocion-critico'
    };

    return clases[emocion as keyof typeof clases] || '';
  }

  getIconoEmocion(emocion: string | undefined): string {
    const iconos: {[key: string]: string} = {
      'ESTRES': '😫',
      'ANSIEDAD': '😰',
      'TRISTEZA': '😢',
      'ENOJO': '😠',
      'MIEDO': '😨',
      'FELICIDAD': '😊',
      'CALMA': '😌',
      'CRITICO': '🚨',
      'NEUTRAL': '😐'
    };

    return iconos[emocion || 'NEUTRAL'] || '😐';
  }
}
