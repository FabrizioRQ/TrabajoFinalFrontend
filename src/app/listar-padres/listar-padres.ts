import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PadreDto } from '../../model/padre-dto.model';
import { PadreService } from '../Services/padre-service';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-listar-padres',
  templateUrl: './listar-padres.html',
  styleUrls: ['./listar-padres.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ]
})
export class ListarPadres implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  // Datos
  padres: PadreDto[] = [];
  padresFiltrados: PadreDto[] = [];
  reporteHijos: string[] = [];
  padresConNinosMenores: PadreDto[] = [];

  // Estados
  loading = false;
  selectedTabIndex = 0;

  // Formularios
  searchForm: FormGroup;
  idSearchForm: FormGroup;

  // Columnas de la tabla
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'acciones'];
  displayedColumnsReporte: string[] = ['nombre', 'apellido'];

  constructor(
    private padreService: PadreService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      nombre: [''],
      apellido: ['']
    });

    this.idSearchForm = this.fb.group({
      id: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarTodosLosPadres();
  }

  // 🔹 Cargar todos los padres
  cargarTodosLosPadres(): void {
    this.loading = true;
    this.padreService.obtenerTodosLosPadres().subscribe({
      next: (data) => {
        console.log('✅ Padres cargados:', data);
        this.padres = data;
        this.padresFiltrados = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar padres:', error);
        this.mostrarError('Error al cargar los padres');
        this.loading = false;
      }
    });
  }

  // 🔹 Buscar por ID
  buscarPorId(): void {
    if (this.idSearchForm.valid) {
      const id = this.idSearchForm.get('id')?.value;
      this.loading = true;
      this.padreService.obtenerPadrePorId(id).subscribe({
        next: (padre) => {
          this.padresFiltrados = [padre];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al buscar padre por ID:', error);
          this.mostrarError('No se encontró el padre con el ID especificado');
          this.padresFiltrados = [];
          this.loading = false;
        }
      });
    }
  }

  // 🔹 Buscar por nombre
  buscarPorNombre(): void {
    const nombre = this.searchForm.get('nombre')?.value;
    if (nombre) {
      this.loading = true;
      this.padreService.buscarPorNombre(nombre).subscribe({
        next: (data) => {
          this.padresFiltrados = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al buscar por nombre:', error);
          this.mostrarError('Error al buscar por nombre');
          this.loading = false;
        }
      });
    }
  }

  // 🔹 Buscar por apellido
  buscarPorApellido(): void {
    const apellido = this.searchForm.get('apellido')?.value;
    if (apellido) {
      this.loading = true;
      this.padreService.buscarPorApellidoPrefijo(apellido).subscribe({
        next: (data) => {
          this.padresFiltrados = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al buscar por apellido:', error);
          this.mostrarError('Error al buscar por apellido');
          this.loading = false;
        }
      });
    }
  }

  // 🔹 Cargar reporte de cantidad de hijos
  cargarReporteCantidadHijos(): void {
    this.loading = true;
    console.log('🔄 Cargando reporte de cantidad de hijos...');
    this.padreService.reporteCantidadHijos().subscribe({
      next: (data) => {
        console.log('📊 Reporte hijos recibido:', data);
        console.log('📊 Número de registros:', data.length);
        this.reporteHijos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar reporte:', error);
        console.error('❌ Error completo:', error);
        this.mostrarError('Error al cargar el reporte');
        this.loading = false;
      }
    });
  }

  // 🔹 Cargar padres con niños menores
  cargarPadresConNinosMenores(): void {
    this.loading = true;
    console.log('🔄 Cargando padres con niños menores...');
    this.padreService.padresConNiñosMenores().subscribe({
      next: (data) => {
        console.log('👶 Padres con niños menores recibido:', data);
        console.log('👶 Número de registros:', data.length);
        this.padresConNinosMenores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar padres con niños menores:', error);
        console.error('❌ Error completo:', error);
        this.mostrarError('Error al cargar padres con niños menores');
        this.loading = false;
      }
    });
  }

  // 🔹 Limpiar búsquedas
  limpiarBusqueda(): void {
    this.searchForm.reset();
    this.idSearchForm.reset();
    this.padresFiltrados = this.padres;
  }

  // 🔹 Eliminar padre (con confirmación nativa)
  eliminarPadre(padre: PadreDto): void {
    if (!padre.id) {
      this.mostrarError('No se puede eliminar: ID no válido');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a ${padre.nombre} ${padre.apellido}?`);

    if (confirmacion) {
      this.padreService.eliminarPadre(padre.id).subscribe({
        next: () => {
          this.mostrarExito('Padre eliminado correctamente');
          this.cargarTodosLosPadres();
        },
        error: (error) => {
          console.error('Error al eliminar padre:', error);
          this.mostrarError('Error al eliminar el padre');
        }
      });
    }
  }

  // 🔹 Editar padre (formulario simple)
  editarPadre(padre: PadreDto): void {
    if (!padre.id) {
      this.mostrarError('No se puede editar: ID no válido');
      return;
    }

    const nuevoNombre = prompt('Nuevo nombre:', padre.nombre);
    const nuevoApellido = prompt('Nuevo apellido:', padre.apellido);

    if (nuevoNombre && nuevoApellido) {
      const padreActualizado: PadreDto = {
        id: padre.id,
        nombre: nuevoNombre,
        apellido: nuevoApellido
      };

      this.padreService.actualizarPadre(padre.id, padreActualizado).subscribe({
        next: () => {
          this.mostrarExito('Padre actualizado correctamente');
          this.cargarTodosLosPadres();
        },
        error: (error) => {
          console.error('Error al actualizar padre:', error);
          this.mostrarError('Error al actualizar el padre');
        }
      });
    }
  }

  // 🔹 Cambio de pestaña - MEJORADO
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    console.log('🔍 Cambiando a pestaña:', event.index);

    switch (event.index) {
      case 0: // Lista principal
        if (this.padres.length === 0) {
          this.cargarTodosLosPadres();
        }
        break;
      case 1: // Reporte cantidad hijos
        this.cargarReporteCantidadHijos();
        break;
      case 2: // Padres con niños menores
        this.cargarPadresConNinosMenores();
        break;
    }
  }

  // 🔹 Método para forzar recarga de reportes
  recargarReportes(): void {
    if (this.selectedTabIndex === 1) {
      this.cargarReporteCantidadHijos();
    } else if (this.selectedTabIndex === 2) {
      this.cargarPadresConNinosMenores();
    }
  }

  // 🔹 Utilidades
  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
