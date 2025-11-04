import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Definición de una interfaz para los datos del psicólogo
interface PsicologoData {
  userId: string;
  nombre: string;
  correo: string;
  sexo: string;
}

@Component({
  selector: 'app-psicologo-component',
  standalone: true, // Componente standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './psicologo-component.html',
  styleUrl: './psicologo-component.css',
})
export class PsicologoComponent {

  psicologo: PsicologoData = {
    userId: '',
    nombre: '',
    correo: '',
    sexo: ''
  };


  opcionesSexo: string[] = [
    'Masculino',
    'Femenino',
    'No binario',
    'Prefiero no decirlo'
  ];

  mensaje: string = '';
  mensajeEsError: boolean = false;

  constructor() { }

  async registrarPsicologo(): Promise<void> {
    this.mensaje = 'Procesando registro...';
    this.mensajeEsError = false;

    if (!this.psicologo.userId || !this.psicologo.nombre || !this.psicologo.correo || !this.psicologo.sexo) {
      this.mensaje = '⚠️ Todos los campos son obligatorios.';
      this.mensajeEsError = true;
      return;
    }

    try {

      await new Promise(resolve => setTimeout(resolve, 1000));

      this.mensaje = `✅ Psicólogo(a) ${this.psicologo.nombre} registrado(a) con éxito.`;
      this.mensajeEsError = false;

    } catch (error) {
      console.error('Error al registrar:', error);
      this.mensaje = '❌ Error al intentar registrar el psicólogo. Intente de nuevo.';
      this.mensajeEsError = true;
    }
  }
}
