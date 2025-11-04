import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-actividades-juego',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './actividades-juego.html',
  styleUrl: './actividades-juego.css',
})
export class ActividadesJuego {
  childId = '';

  actividades = [
    { id: 1, nombre: 'Memoria', fecha: '07/09/2025', progreso: '900 puntos' },
    { id: 2, nombre: 'Aventura en el bosque', fecha: '06/09/2025', progreso: 'Completado' },
    { id: 3, nombre: 'Rompecabezas', fecha: '05/09/2025', progreso: 'Duración: 10 min' },
  ];
}
