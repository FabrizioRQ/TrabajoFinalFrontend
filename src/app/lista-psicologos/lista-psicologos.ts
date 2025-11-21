import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

import { PsicologoDTO } from '../../model/psicologo-dto.model';
import {PsicologoService} from '../Services/psicologo-service';

@Component({
  selector: 'app-lista-psicologos',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './lista-psicologos.html',
  styleUrl: './lista-psicologos.css',
})
export class ListaPsicologos implements OnInit {
  psicologos: PsicologoDTO[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(private psicologoService: PsicologoService) {}

  ngOnInit() {
    this.cargarPsicologos();
  }

  cargarPsicologos() {
    this.cargando = true;
    this.error = '';

    this.psicologoService.obtenerPsicologos().subscribe({
      next: (data: PsicologoDTO[]) => {
        this.psicologos = data;
        this.cargando = false;
        console.log('Psicólogos encontrados:', data);
      },
      error: (error) => {
        console.error('Error al obtener psicólogos:', error);
        this.error = 'Error al cargar los psicólogos. Por favor, intente nuevamente.';
        this.cargando = false;
        this.psicologos = [];
      }
    });
  }
}
