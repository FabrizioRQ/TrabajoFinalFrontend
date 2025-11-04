import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancelar-suscripcion',
  standalone: true, // Componente standalone
  imports: [CommonModule, NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './cancelar-suscripcion.html',
  styleUrl: './cancelar-suscripcion.css',
})
export class CancelarSuscripcion {
  // --- Estado Principal ---
  suscripcionActiva: boolean = true; // Simula si el usuario tiene una suscripción activa

  // --- Estado del Modal de Confirmación ---
  mostrarModalPausa: boolean = false;
  mostrarModalCancelacion: boolean = false;

  // --- Datos del Modal de Cancelación ---
  motivosCancelacion: string[] = [
    'Alto costo',
    'Falta de uso',
    'Problemas técnicos',
    'Ya no necesito el servicio',
    'Otro'
  ];
  motivoSeleccionado: string = '';

  // --- Opciones del Modal de Pausa/Confirmación ---
  estoySeguro: boolean = false;
  pausarPagos: boolean = false;

  constructor() { }

  // --- Lógica de Acciones ---

  /**
   * Abre el modal para pausar/desactivar la suscripción.
   */
  iniciarPausa(): void {
    if (this.suscripcionActiva) {
      this.mostrarModalPausa = true;
      this.estoySeguro = false; // Resetear checkboxes
      this.pausarPagos = false;
      console.log('Abriendo modal para pausar suscripción.');
    } else {
      alert('La suscripción no está activa.');
    }
  }

  /**
   * Confirma la pausa (botón azul en el modal).
   */
  confirmarPausa(): void {
    if (this.estoySeguro) {
      console.log('Suscripción pausada. Pausar pagos:', this.pausarPagos);
      // Simular cambio de estado
      this.suscripcionActiva = false;
      this.cerrarModales();
      alert('Suscripción pausada temporalmente.');
    } else {
      alert('Debes confirmar que estás seguro para continuar.');
    }
  }

  /**
   * Abre el modal de cancelación permanente.
   */
  iniciarCancelacion(): void {
    if (this.suscripcionActiva) {
      this.mostrarModalCancelacion = true;
      this.motivoSeleccionado = ''; // Resetear motivo
      console.log('Abriendo modal para cancelación permanente.');
    } else {
      alert('La suscripción no está activa para cancelar.');
    }
  }

  /**
   * Confirma la cancelación permanente.
   */
  confirmarCancelacion(): void {
    console.log('Suscripción cancelada permanentemente. Motivo:', this.motivoSeleccionado);
    // Simular cambio de estado
    this.suscripcionActiva = false;
    this.cerrarModales();
    alert('Suscripción cancelada permanentemente.');
  }

  /**
   * Cierra cualquier modal activo.
   */
  cerrarModales(): void {
    this.mostrarModalPausa = false;
    this.mostrarModalCancelacion = false;
  }

  /**
   * Simula la reactivación de la suscripción.
   */
  reactivarSuscripcion(): void {
    if (!this.suscripcionActiva) {
      console.log('Reactivando suscripción...');
      this.suscripcionActiva = true;
      alert('Suscripción reactivada con éxito!');
    } else {
      alert('La suscripción ya está activa.');
    }
  }
}
