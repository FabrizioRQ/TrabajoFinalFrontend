// recomendaciones-ia.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, catchError, finalize, takeUntil, timeout } from 'rxjs/operators';
import { of, Subject, timer, Subscription } from 'rxjs';
import { NinoService } from '../Services/nino-service';
import { AuthService } from '../Services/auth-service';
import { Recomendacion, RecomendacionesService } from '../Services/recomendaciones-service';
import { DiarioService } from '../Services/diario-service';
import { DiarioEmocionalDTO } from '../../model/DiarioEmocionalDTO';

@Component({
  selector: 'app-recomendaciones-ia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones-ia.html',
  styleUrls: ['./recomendaciones-ia.css']
})
export class RecomendacionesIa implements OnInit, OnDestroy {
  recomendaciones: Recomendacion[] = [];
  cargando: boolean = true;
  emocionPredominante: string = '';
  ultimaActualizacion: string = '';
  emocionAnterior: string = '';

  // Control de estado
  datosListos: boolean = false;
  errorCarga: boolean = false;
  mensajeError: string = '';

  private destroy$ = new Subject<void>();
  private refreshSubscription?: Subscription;

  constructor(
    private recomendacionesService: RecomendacionesService,
    private diarioService: DiarioService,
    private ninoService: NinoService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRecomendacionesConTimeout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshSubscription?.unsubscribe();
  }

  private cargarRecomendacionesConTimeout(): void {
    this.cargando = true;
    this.datosListos = false;
    this.errorCarga = false;

    const userId = this.authService.getUserId();

    if (!userId) {
      console.log('🚫 Usuario no autenticado - cargando defaults');
      this.cargarRecomendacionesPorDefecto();
      return;
    }

    console.log('🎯 Iniciando carga de datos para usuario:', userId);

    // Timeout de 10 segundos máximo
    this.ninoService.obtenerNinoPorUsuarioId(userId).pipe(
      timeout(10000),
      switchMap(nino => {
        if (nino && nino.id) {
          console.log('👶 Niño encontrado:', nino.id);
          return this.diarioService.getEmocionesByNiñoId(nino.id).pipe(
            timeout(10000),
            catchError(error => {
              console.error('❌ Error cargando emociones:', error);
              this.mostrarError('Error al cargar emociones');
              return of([] as DiarioEmocionalDTO[]);
            })
          );
        } else {
          console.warn('⚠️ No se encontró niño para el usuario');
          this.mostrarError('No se encontró perfil de niño');
          return of([] as DiarioEmocionalDTO[]);
        }
      }),
      catchError(error => {
        console.error('❌ Error general:', error);
        this.mostrarError('Error de conexión');
        return of([] as DiarioEmocionalDTO[]);
      }),
      finalize(() => {
        this.cargando = false;
        this.cdRef.detectChanges(); // Forzar detección de cambios
      })
    ).subscribe({
      next: (emociones) => {
        this.procesarDatosReales(emociones);
      },
      error: (error) => {
        console.error('❌ Error en suscripción:', error);
        this.mostrarError('Error inesperado');
      }
    });
  }

  private procesarDatosReales(emociones: DiarioEmocionalDTO[]): void {
    console.log('📊 Procesando', emociones.length, 'emociones:', emociones);

    if (emociones.length === 0) {
      console.log('📭 No hay emociones registradas - usando defaults');
      this.cargarRecomendacionesPorDefecto();
      return;
    }

    // Obtener la emoción REAL de los datos
    const emocionReal = this.obtenerEmocionReal(emociones);
    console.log('🎭 Emoción detectada:', emocionReal);

    // Generar recomendaciones basadas en la emoción REAL
    this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones(emociones);
    this.emocionPredominante = emocionReal;
    this.emocionAnterior = emocionReal;
    this.ultimaActualizacion = new Date().toLocaleTimeString('es-ES');
    this.datosListos = true;

    console.log('✅ Datos reales cargados:', {
      emocion: this.emocionPredominante,
      recomendaciones: this.recomendaciones.length,
      emocionesAnalizadas: emociones.length
    });

    // Iniciar monitoreo solo después de tener datos reales
    this.iniciarMonitoreoTiempoReal();
  }

  private obtenerEmocionReal(emociones: DiarioEmocionalDTO[]): string {
    // Usar la emoción más reciente de los datos reales
    const ultimaEmocion = emociones[emociones.length - 1].emocionRegistrada;

    console.log('🔍 Última emoción del API:', ultimaEmocion);

    const emocionesMap: {[key: string]: string} = {
      'TRISTE': 'tristeza', 'TRISTEZA': 'tristeza',
      'ANSIOSO': 'ansiedad', 'ANSIEDAD': 'ansiedad',
      'ENOJADO': 'enojo', 'ENOJO': 'enojo',
      'ESTRESADO': 'estrés', 'ESTRES': 'estrés',
      'FELIZ': 'felicidad', 'FELICIDAD': 'felicidad',
      'NEUTRAL': 'calma', 'CALMA': 'calma',
      'MIEDO': 'ansiedad'
    };

    const emocionMapeada = emocionesMap[ultimaEmocion.toUpperCase()] || 'neutral';
    console.log('🗺️ Emoción mapeada:', emocionMapeada);

    return emocionMapeada;
  }

  // 🔥 CAMBIO: Hacer público este método
  cargarRecomendacionesPorDefecto(): void {
    console.log('🔄 Cargando recomendaciones por defecto');
    this.recomendaciones = this.recomendacionesService.obtenerRecomendaciones([]);
    this.emocionPredominante = 'neutral';
    this.emocionAnterior = 'neutral';
    this.ultimaActualizacion = new Date().toLocaleTimeString('es-ES');
    this.datosListos = true;
    this.cargando = false;
    this.errorCarga = false;

    // Iniciar monitoreo incluso con datos por defecto
    this.iniciarMonitoreoTiempoReal();
  }

  private mostrarError(mensaje: string): void {
    this.errorCarga = true;
    this.mensajeError = mensaje;
    this.datosListos = false;
    this.cargando = false;
    console.error('💥 Error:', mensaje);
  }

  private iniciarMonitoreoTiempoReal(): void {
    console.log('🔄 Iniciando monitoreo en tiempo real');

    this.refreshSubscription = timer(30000, 30000) // Esperar 30s después de carga inicial
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.verificarCambiosEmocionales();
      });
  }

  private verificarCambiosEmocionales(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.ninoService.obtenerNinoPorUsuarioId(userId).pipe(
      switchMap(nino => {
        if (nino && nino.id) {
          return this.diarioService.getEmocionesByNiñoId(nino.id).pipe(
            catchError(() => of([] as DiarioEmocionalDTO[]))
          );
        }
        return of([] as DiarioEmocionalDTO[]);
      })
    ).subscribe({
      next: (emociones) => {
        if (emociones.length === 0) return;

        const nuevaEmocion = this.obtenerEmocionReal(emociones);

        if (nuevaEmocion !== this.emocionAnterior) {
          console.log(`🎭 ¡Cambio detectado! ${this.emocionAnterior} → ${nuevaEmocion}`);
          this.emocionAnterior = nuevaEmocion;
          this.emocionPredominante = nuevaEmocion;
          this.actualizarRecomendacionesConEmocionReal(emociones);
        }
      }
    });
  }

  private actualizarRecomendacionesConEmocionReal(emociones: DiarioEmocionalDTO[]): void {
    const nuevasRecomendaciones = this.recomendacionesService.obtenerRecomendaciones(emociones);
    this.recomendaciones = nuevasRecomendaciones;
    this.ultimaActualizacion = new Date().toLocaleTimeString('es-ES') + ' (Auto)';

    console.log('⚡ Recomendaciones actualizadas con emoción real:', {
      emocion: this.emocionPredominante,
      nuevasRecomendaciones: nuevasRecomendaciones.length
    });

    this.cdRef.detectChanges(); // Forzar actualización de la vista
  }

  actualizarRecomendaciones(): void {
    console.log('🔄 Recargando manualmente...');
    this.cargarRecomendacionesConTimeout();
  }

  reintentarCarga(): void {
    this.errorCarga = false;
    this.cargarRecomendacionesConTimeout();
  }

  trackByRecomendacion(index: number, recomendacion: Recomendacion): string {
    return `${recomendacion.titulo}-${this.emocionPredominante}-${index}`;
  }
}
