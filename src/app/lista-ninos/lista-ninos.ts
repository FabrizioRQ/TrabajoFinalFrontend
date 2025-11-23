import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NiñoDto } from '../../model/niño-dto.model';
import { UsuarioDTO } from '../../model/usuario-dto.model';
import { PadreDto } from '../../model/padre-dto.model';
import { AvatarDto } from '../../model/avatar-dto.model';
import {NinoService} from '../Services/nino-service';
import {UserService} from '../Services/user-service';
import {PadreService} from '../Services/padre-service';
import {AvatarService} from '../Services/avatar-service';

interface NinoCompleto {
  nino: NiñoDto;
  usuario?: UsuarioDTO;
  padre?: PadreDto;
  avatar?: AvatarDto;
  psicologo?: UsuarioDTO;
  conteoRegistros?: number;
  estadisticas?: any;
}

@Component({
  selector: 'app-lista-ninos',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-ninos.html',
  styleUrl: './lista-ninos.css',
})
export class ListaNinos implements OnInit {
  // Datos principales
  ninos: NinoCompleto[] = [];
  ninosFiltrados: NinoCompleto[] = [];

  // Estados
  loading: boolean = false;
  error: string = '';
  vistaActiva: string = 'lista'; // 'lista', 'emociones', 'dashboard'

  // Filtros
  filtroUUID: string = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  idPsicologoFiltro: string = '';

  // Datos para reportes
  estadisticasEmociones: any[] = [];
  dashboardData: any[] = [];
  ninosConConteo: any[] = [];

  constructor(
    private ninoService: NinoService,
    private userService: UserService,
    private padreService: PadreService,
    private avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.cargarNinosCompletos();
  }

  // Cargar todos los niños con información completa
  cargarNinosCompletos() {
    this.loading = true;
    this.error = '';

    this.ninoService.obtenerNinos().subscribe({
      next: async (ninosData: NiñoDto[]) => {
        try {
          this.ninos = await this.enriquecerDatosNinos(ninosData);
          this.aplicarFiltros();
        } catch (error) {
          this.error = 'Error al cargar información adicional';
          console.error('Error:', error);
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar la lista de niños';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  async enriquecerDatosNinos(ninosData: NiñoDto[]): Promise<NinoCompleto[]> {
    const ninosCompletos: NinoCompleto[] = [];

    try {
      const [usuarios, padres, avatares] = await Promise.all([
        this.userService.obtenerUsuarios().toPromise() || [],
        this.padreService.obtenerTodosLosPadres().toPromise() || [],
        this.avatarService.obtenerTodosLosAvatares().toPromise() || []
      ]);

      for (const nino of ninosData) {
        const ninoCompleto: NinoCompleto = { nino };

        // Enriquecer datos
        ninoCompleto.usuario = usuarios?.find(u => u.id === nino.idUsuario);
        ninoCompleto.padre = padres?.find(p => p.id === nino.idPadre);
        ninoCompleto.avatar = avatares?.find(a => a.id === nino.idAvatar);

        ninosCompletos.push(ninoCompleto);
      }
    } catch (error) {
      console.error('Error enriqueciendo datos:', error);
    }

    return ninosCompletos;
  }

  // Métodos para las diferentes vistas
  cargarNinosPorPsicologo() {
    if (!this.idPsicologoFiltro) return;

    this.loading = true;
    this.ninoService.obtenerNinosPorPsicologo(+this.idPsicologoFiltro).subscribe({
      next: async (ninosData: NiñoDto[]) => {
        this.ninos = await this.enriquecerDatosNinos(ninosData);
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar niños por psicólogo';
        this.loading = false;
      }
    });
  }

  cargarNinosConEmociones() {
    if (!this.filtroFechaInicio || !this.filtroFechaFin) {
      this.error = 'Debe seleccionar fecha inicio y fin';
      return;
    }

    this.loading = true;
    this.ninoService.obtenerNinosConEmocionesEnRango(
      this.filtroFechaInicio,
      this.filtroFechaFin
    ).subscribe({
      next: async (ninosData: NiñoDto[]) => {
        this.ninos = await this.enriquecerDatosNinos(ninosData);
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar niños con emociones';
        this.loading = false;
      }
    });
  }

  cargarConteoRegistros() {
    if (!this.idPsicologoFiltro) return;

    this.loading = true;
    this.ninoService.obtenerNinosConConteoRegistros(+this.idPsicologoFiltro).subscribe({
      next: (data) => {
        this.ninosConConteo = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar conteo de registros';
        this.loading = false;
      }
    });
  }

  cargarEstadisticasEmociones() {
    if (!this.filtroFechaInicio || !this.filtroFechaFin) {
      this.error = 'Debe seleccionar fecha inicio y fin';
      return;
    }

    this.loading = true;
    this.ninoService.obtenerEstadisticasEmociones(
      this.filtroFechaInicio,
      this.filtroFechaFin
    ).subscribe({
      next: (data) => {
        this.estadisticasEmociones = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar estadísticas de emociones';
        this.loading = false;
      }
    });
  }

  cargarDashboard() {
    if (!this.idPsicologoFiltro) return;

    this.loading = true;
    this.ninoService.obtenerDashboardNiños(+this.idPsicologoFiltro).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar dashboard';
        this.loading = false;
      }
    });
  }

  // Filtros y utilidades
  aplicarFiltros() {
    this.ninosFiltrados = this.ninos.filter(nino => {
      const cumpleUUID = !this.filtroUUID ||
        nino.nino.id?.toString().includes(this.filtroUUID) ||
        nino.usuario?.nombreCompleto.toLowerCase().includes(this.filtroUUID.toLowerCase());

      return cumpleUUID;
    });
  }

  cambiarVista(vista: string) {
    this.vistaActiva = vista;
    this.error = '';

    switch(vista) {
      case 'lista':
        this.cargarNinosCompletos();
        break;
      case 'emociones':
        // Se cargará al ejecutar la consulta
        break;
      case 'dashboard':
        // Se cargará al ejecutar la consulta
        break;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtroUUID = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.idPsicologoFiltro = '';
    this.aplicarFiltros();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }
}
