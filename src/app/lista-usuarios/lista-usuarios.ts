// lista-usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { UserService, UsuarioDTO } from '../Services/user-service';

@Component({
  selector: 'app-lista-usuarios',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule
  ],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})
export class ListaUsuarios implements OnInit {
  usuarios: UsuarioDTO[] = [];
  cargando: boolean = true;
  error: string | null = null;

  columnasMostradas: string[] = ['nombreCompleto', 'tipoUsuario', 'correoElectronico'];

  // Control de tipo de consulta
  tipoConsulta: string = 'todos';

  // Parámetros para consultas específicas
  rol: string = '';
  textoNombre: string = '';

  // Parámetros para búsqueda avanzada
  correo: string = '';
  nombre: string = '';
  tipoUsuario: string = '';
  estado: string = '';
  rolAvanzado: string = '';
  ordenarPor: string = 'nombre';
  orden: string = 'asc';

  // Opciones para selects
  tiposUsuario: string[] = ['ADMIN', 'USER', 'MODERATOR', 'PSICOLOGO'];
  estadosUsuario: string[] = ['ACTIVO', 'INACTIVO', 'PENDIENTE'];
  opcionesOrdenar: string[] = ['nombre', 'correo', 'fechaCreacion'];
  opcionesOrden: string[] = ['asc', 'desc'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Método principal para ejecutar consultas
  ejecutarConsulta(): void {
    this.cargando = true;
    this.error = null;

    switch (this.tipoConsulta) {
      case 'todos':
        this.cargarUsuarios();
        break;

      case 'porRol':
        this.consultarPorRol();
        break;

      case 'inicioNombre':
        this.consultarPorInicioNombre();
        break;

      case 'psicologos':
        this.consultarPsicologos();
        break;

      case 'avanzada':
        this.consultarBusquedaAvanzada();
        break;

      default:
        this.cargarUsuarios();
    }
  }

  // Consulta 1: Todos los usuarios
  cargarUsuarios(): void {
    this.userService.obtenerUsuarios().subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error: any) => {
        this.error = 'Error cargando usuarios.';
        this.cargando = false;
        console.error(error);
      }
    });
  }

  // Consulta 2: Por rol específico
  consultarPorRol(): void {
    if (!this.rol.trim()) {
      this.error = 'Por favor ingrese un rol para buscar.';
      this.cargando = false;
      return;
    }

    this.userService.obtenerPorRol(this.rol).subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error: any) => {
        this.error = 'Error buscando por rol.';
        this.cargando = false;
        console.error(error);
      }
    });
  }

  // Consulta 3: Por inicio del nombre
  consultarPorInicioNombre(): void {
    if (!this.textoNombre.trim()) {
      this.error = 'Por favor ingrese un texto para buscar.';
      this.cargando = false;
      return;
    }

    this.userService.buscarPorInicioNombre(this.textoNombre).subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error: any) => {
        this.error = 'Error buscando por nombre.';
        this.cargando = false;
        console.error(error);
      }
    });
  }

  // Consulta 4: Solo psicólogos
  consultarPsicologos(): void {
    this.userService.listarPsicologos().subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error: any) => {
        this.error = 'Error cargando psicólogos.';
        this.cargando = false;
        console.error(error);
      }
    });
  }

  // Consulta 5: Búsqueda avanzada
  consultarBusquedaAvanzada(): void {
    const params = {
      correo: this.correo || null,
      nombre: this.nombre || null,
      tipo: this.tipoUsuario || null,
      estado: this.estado || null,
      rol: this.rolAvanzado || null,
      ordenarPor: this.ordenarPor,
      orden: this.orden
    };

    this.userService.busquedaAvanzada(params).subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (error: any) => {
        this.error = 'Error en búsqueda avanzada.';
        this.cargando = false;
        console.error(error);
      }
    });
  }

  // Limpiar filtros
  limpiarFiltros(): void {
    this.rol = '';
    this.textoNombre = '';
    this.correo = '';
    this.nombre = '';
    this.tipoUsuario = '';
    this.estado = '';
    this.rolAvanzado = '';
    this.ordenarPor = 'nombre';
    this.orden = 'asc';
    this.tipoConsulta = 'todos';
    this.cargarUsuarios();
  }

  getTipoUsuarioClass(tipoUsuario: string): string {
    const tipo = tipoUsuario.toLowerCase();
    if (tipo.includes('admin')) return 'admin';
    if (tipo.includes('moderador')) return 'moderator';
    if (tipo.includes('psicologo')) return 'psicologo';
    return 'user';
  }
}
