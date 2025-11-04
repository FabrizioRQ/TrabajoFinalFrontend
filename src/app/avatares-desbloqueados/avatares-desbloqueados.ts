import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-avatares-desbloqueados',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './avatares-desbloqueados.html',
  styleUrl: './avatares-desbloqueados.css',
})
export class AvataresDesbloqueados {
  childId = '';

  sesiones = [
    {
      fecha: '12/09/2025',
      duracion: '50 min',
      nota: 'Trabajamos la expresión de emociones con juegos.'
    },
    {
      fecha: '10/09/2025',
      duracion: '45 min',
      nota: 'Discutimos la importancia de la comunicación.'
    }
  ];

  consultar() {
    if (!this.childId.trim()) {
      this.sesiones = [];
      return;
    }

    // Simulación: si el ID termina en "1", no hay sesiones
    this.sesiones = this.childId.endsWith('1')
      ? []
      : [
        {
          fecha: '12/09/2025',
          duracion: '50 min',
          nota: 'Trabajamos la expresión de emociones con juegos.'
        },
        {
          fecha: '10/09/2025',
          duracion: '45 min',
          nota: 'Discutimos la importancia de la comunicación.'
        }
      ];
  }
}
