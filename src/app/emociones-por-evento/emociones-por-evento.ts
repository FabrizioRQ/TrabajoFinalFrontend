import { Component } from '@angular/core';

@Component({
  selector: 'app-emociones-por-evento',
  imports: [],
  templateUrl: './emociones-por-evento.html',
  styleUrl: './emociones-por-evento.css',
})
export class EmocionesPorEvento {
  emotions = [
    { evento: 'Examen', estado: 'Ansioso', explicacion: 'El examen pudo contribuir a tu aumento de ansiedad' }
  ];
}
