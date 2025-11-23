import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-psicologo-panel',
  imports: [],
  templateUrl: './psicologo-panel.html',
  styleUrl: './psicologo-panel.css',
})
export class PsicologoPanel {
  private router = inject(Router);
  cerrarSesion() {
    console.log('Cerrando sesión...');
    alert('Sesión cerrada correctamente');
    this.router.navigate(['']);
  }
}
