import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PsicologoService} from '../Services/psicologo-service';
import {PsicologoDTO} from '../../model/psicologo-dto.model';

@Component({
  selector: 'app-psicologo-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './psicologo-component.html',
  styleUrls: ['./psicologo-component.css']
})
export class PsicologoComponent {

  psicologo: PsicologoDTO = {
    especialidad: '',
    numeroColegiatura: '',
    idUsuario: 0
  };

  mensaje: string = '';
  mensajeEsError: boolean = false;

  constructor(private psicologoService: PsicologoService) {}

  registrarPsicologo(): void {
    this.mensaje = 'Procesando registro...';
    this.mensajeEsError = false;

    if (!this.psicologo.especialidad || !this.psicologo.numeroColegiatura || !this.psicologo.idUsuario) {
      this.mensaje = '⚠️ Todos los campos son obligatorios.';
      this.mensajeEsError = true;
      return;
    }

    this.psicologoService.registrarPsicologo(this.psicologo).subscribe({
      next: (data) => {
        this.mensaje = `✅ Psicólogo registrado con éxito (ID: ${data.id}).`;
        this.mensajeEsError = false;
        this.psicologo = { especialidad: '', numeroColegiatura: '', idUsuario: 0 };
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.mensaje = '❌ Error al intentar registrar el psicólogo. Intente de nuevo.';
        this.mensajeEsError = true;
      }
    });
  }
}
