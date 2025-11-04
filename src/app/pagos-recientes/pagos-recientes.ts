import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

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
export class PagosRecientes {
  padreID: string = '';

  pagos = [
    { monto: 's/. 50', fecha: '05/09/2025', estado: 'Completado' },
    { monto: 's/. 50', fecha: '05/08/2025', estado: 'Pendiente' },
    { monto: 's/. 50', fecha: '04/08/2025', estado: 'Fallido' }
  ];

  consultar() {
    console.log('Consultando pagos del padre/tutor con ID:', this.padreID);
    // Aquí podrías llamar a un servicio que consulte pagos en la base de datos
  }
}
