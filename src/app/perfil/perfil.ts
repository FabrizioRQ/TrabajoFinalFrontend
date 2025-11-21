import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {UserService, UsuarioDTO} from '../Services/user-service';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  nombreCompleto: string = '';
  correoElectronico: string = '';
  tipoUsuario: string = '';
  id: number = 0;

  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // Cargar los datos del perfil desde el backend
  cargarPerfil(): void {
    this.isLoading = true;

    this.userService.obtenerMiPerfil().subscribe({
      next: (usuario: UsuarioDTO) => {
        this.nombreCompleto = usuario.nombreCompleto;
        this.correoElectronico = usuario.correoElectronico;
        this.tipoUsuario = usuario.tipoUsuario;
        this.id = usuario.id;
        this.isLoading = false;

        console.log('Perfil cargado:', usuario);
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        alert('Error al cargar el perfil: ' + error.message);
        this.isLoading = false;
      }
    });
  }

  // Método que se llama al hacer clic en "Guardar"
  guardarPerfil(): void {
    if (!this.nombreCompleto.trim()) {
      alert('El nombre completo es obligatorio');
      return;
    }

    this.isSaving = true;

    const usuarioActualizado: UsuarioDTO = {
      id: this.id,
      nombreCompleto: this.nombreCompleto,
      correoElectronico: this.correoElectronico,
      tipoUsuario: this.tipoUsuario
    };

    console.log('Guardando perfil...', usuarioActualizado);

    this.userService.actualizarMiPerfil(usuarioActualizado).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.isSaving = false;

        if (response.success) {
          alert(`Perfil de ${this.nombreCompleto} actualizado con éxito!`);
        } else {
          alert('Error al actualizar el perfil: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error al guardar el perfil:', error);
        this.isSaving = false;

        if (error.error && typeof error.error === 'string') {
          alert('Error: ' + error.error);
        } else {
          alert('Error al actualizar el perfil. Intente nuevamente.');
        }
      }
    });
  }
}
