import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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
export class ListaPsicologos {
  uuid: string = '';

  psicologos = [
    { nombre: 'Dr. Juan Pérez', edad: '45', estado: 'Disponible' },
    { nombre: 'Lic. María Torres', edad: '39', estado: 'Ocupado' },
    { nombre: 'Lic. Carlos Rivas', edad: '41', estado: 'De vacaciones' }
  ];

  buscar() {
    console.log('Buscando psicólogos para el UUID:', this.uuid);
  }
}
