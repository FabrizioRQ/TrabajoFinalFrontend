import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PsicologoDTO } from '../../model/psicologo-dto.model';
import { PsicologoService } from '../Services/psicologo-service';

@Component({
  selector: 'app-lista-psicologos',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './lista-psicologos.html',
  styleUrl: './lista-psicologos.css',
})
export class ListaPsicologos implements OnInit {
  psicologos: PsicologoDTO[] = [];
  cargando: boolean = false;
  error: string = '';

  // Filtros
  tipoBusqueda: string = 'todos';
  idBusqueda: number | null = null;
  especialidadBusqueda: string = '';
  colegiaturaBusqueda: string = '';
  nombreBusqueda: string = '';
  especialidadFiltroBusqueda: string = '';

  constructor(private psicologoService: PsicologoService) {}

  ngOnInit() {
    this.cargarTodosLosPsicologos();
  }

  cargarTodosLosPsicologos() {
    this.cargando = true;
    this.error = '';

    this.psicologoService.obtenerPsicologos().subscribe({
      next: (data: PsicologoDTO[]) => {
        this.psicologos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener psicólogos:', error);
        this.error = 'Error al cargar los psicólogos. Por favor, intente nuevamente.';
        this.cargando = false;
        this.psicologos = [];
      }
    });
  }

  buscar() {
    this.cargando = true;
    this.error = '';
    this.psicologos = [];

    switch (this.tipoBusqueda) {
      case 'todos':
        this.cargarTodosLosPsicologos();
        break;

      case 'id':
        if (this.idBusqueda) {
          this.psicologoService.obtenerPsicologoPorId(this.idBusqueda).subscribe({
            next: (data: PsicologoDTO) => {
              this.psicologos = [data];
              this.cargando = false;
            },
            error: (error) => {
              this.error = 'No se encontró ningún psicólogo con ese ID.';
              this.cargando = false;
            }
          });
        }
        break;

      case 'especialidad':
        if (this.especialidadBusqueda.trim()) {
          this.psicologoService.buscarPorEspecialidad(this.especialidadBusqueda).subscribe({
            next: (data: PsicologoDTO[]) => {
              this.psicologos = data;
              this.cargando = false;
            },
            error: (error) => {
              this.error = 'Error al buscar por especialidad.';
              this.cargando = false;
            }
          });
        }
        break;

      case 'colegiatura':
        if (this.colegiaturaBusqueda.trim()) {
          this.psicologoService.buscarPorNumeroColegiatura(this.colegiaturaBusqueda).subscribe({
            next: (data: PsicologoDTO) => {
              this.psicologos = [data];
              this.cargando = false;
            },
            error: (error) => {
              this.error = 'No se encontró ningún psicólogo con ese número de colegiatura.';
              this.cargando = false;
            }
          });
        }
        break;

      case 'nombre-especialidad':
        if (this.nombreBusqueda.trim()) {
          this.psicologoService.buscarPorNombreYEspecialidad(
            this.nombreBusqueda,
            this.especialidadFiltroBusqueda || undefined
          ).subscribe({
            next: (data: PsicologoDTO[]) => {
              this.psicologos = data;
              this.cargando = false;
            },
            error: (error) => {
              this.error = 'Error al buscar por nombre y especialidad.';
              this.cargando = false;
            }
          });
        }
        break;
    }
  }

  limpiarFiltros() {
    this.tipoBusqueda = 'todos';
    this.idBusqueda = null;
    this.especialidadBusqueda = '';
    this.colegiaturaBusqueda = '';
    this.nombreBusqueda = '';
    this.especialidadFiltroBusqueda = '';
    this.cargarTodosLosPsicologos();
  }
}
