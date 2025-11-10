import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PsicologoService } from '../Services/psicologo-service';

import { PsicologoDTO } from '../../model/psicologo-dto.model';
import {UserService, UsuarioDTO} from '../Services/user-service';

@Component({
  selector: 'app-psicologo-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './psicologo-component.html',
  styleUrls: ['./psicologo-component.css']
})
export class PsicologoComponent implements OnInit {

  psicologo: PsicologoDTO = {
    especialidad: '',
    numeroColegiatura: '',
    idUsuario: 0
  };

  usuarios: UsuarioDTO[] = [];
  mensaje: string = '';
  mensajeEsError: boolean = false;
  cargando: boolean = false;

  constructor(
    private psicologoService: PsicologoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.userService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.mensaje = '❌ Error al cargar la lista de usuarios';
        this.mensajeEsError = true;
        this.cargando = false;
      }
    });
  }

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

  // Método auxiliar para obtener el nombre del usuario seleccionado
  getNombreUsuarioSeleccionado(): string {
    if (!this.psicologo.idUsuario) return '';
    const usuario = this.usuarios.find(u => u.id === this.psicologo.idUsuario);
    return usuario ? usuario.nombreCompleto : '';
  }
}
