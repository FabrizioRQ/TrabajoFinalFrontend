import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-confirmacion-pago',
  imports: [],
  templateUrl: './confirmacion-pago.html',
  styleUrl: './confirmacion-pago.css',
})
export class ConfirmacionPago {
  // En el constructor
  constructor(private router: Router) {}

// Y modifica el método volverInicio
  volverInicio() {
    this.router.navigate(['/user-panel']);
  }
}
