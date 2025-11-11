import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {UserService, UsuarioDTO} from '../Services/user-service';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-lista-usuarios',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButton
  ],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})
export class ListaUsuarios implements OnInit {
  usuarios: UsuarioDTO[] = [];
  cargando: boolean = true;
  error: string | null = null;


  columnasMostradas: string[] = ['nombreCompleto', 'tipoUsuario', 'correoElectronico'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = null;

    this.userService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los usuarios';
        this.cargando = false;
        console.error('Error:', error);
      }
    });
  }

  getTipoUsuarioClass(tipoUsuario: string): string {
    const tipo = tipoUsuario.toLowerCase();
    if (tipo.includes('admin')) return 'admin';
    if (tipo.includes('moderador')) return 'moderator';
    return 'user';
  }
}
