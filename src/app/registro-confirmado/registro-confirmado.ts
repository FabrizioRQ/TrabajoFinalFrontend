// registro-confirmado.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-confirmado',
  imports: [CommonModule, RouterModule],
  templateUrl: './registro-confirmado.html',
  styleUrl: './registro-confirmado.css',
})
export class RegistroConfirmado {
  // Tiempo para redirección automática
  tiempoRestante: number = 8;
  private intervalo: any;

  ngOnInit() {
    // Iniciar cuenta regresiva para redirección automática
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.irALogin();
      }
    }, 1000);
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  irALogin() {
    // Redirigir al login - cambia la ruta según tu configuración
    window.location.href = '/login'; // o this.router.navigate(['/login']) si usas Router
  }
}
