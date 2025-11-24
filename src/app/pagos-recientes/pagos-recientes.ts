import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

import { PagoDTO } from '../../model/pago-dto.model';
import {PagoService} from '../Services/pago-service';
import {AuthService} from '../Services/auth-service';

@Component({
  selector: 'app-pagos-recientes',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './pagos-recientes.html',
  styleUrl: './pagos-recientes.css',
})
export class PagosRecientes implements OnInit {
  pagos: PagoDTO[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private pagoService: PagoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarPagosDelUsuario();
  }

  cargarPagosDelUsuario() {
    this.cargando = true;
    this.error = '';

    try {
      const usuarioId = this.authService.getUserId();

      if (!usuarioId) {
        this.error = 'Usuario no autenticado';
        this.cargando = false;
        return;
      }

      this.pagoService.listarPagosPorUsuario(usuarioId).subscribe({
        next: (pagos) => {
          this.pagos = pagos;
          this.cargando = false;
          console.log('Pagos cargados:', pagos);
        },
        error: (error) => {
          this.error = 'Error al cargar los pagos';
          this.cargando = false;
          console.error('Error al cargar pagos:', error);
        }
      });

    } catch (error) {
      this.error = 'Error al obtener el ID del usuario';
      this.cargando = false;
      console.error('Error:', error);
    }
  }

  // Método auxiliar para formatear la fecha si es necesario
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  // Método auxiliar para traducir estados si es necesario
  traducirEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'COMPLETED': 'Completado',
      'PENDING': 'Pendiente',
      'FAILED': 'Fallido',
      'COMPLETADO': 'Completado',
      'PENDIENTE': 'Pendiente',
      'FALLIDO': 'Fallido'
    };
    return estados[estado] || estado;
  }
}
