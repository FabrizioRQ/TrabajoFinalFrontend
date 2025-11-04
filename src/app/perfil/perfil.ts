import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  nombreCompleto: string = 'Juan Pérez';
  correoElectronico: string = 'juanperez@email.com';

  constructor() { }

  // Método que se llama al hacer clic en "Guardar"
  guardarPerfil(): void {
    console.log('Guardando perfil...');
    console.log('Nombre:', this.nombreCompleto);
    console.log('Correo:', this.correoElectronico);

    alert(`Perfil de ${this.nombreCompleto} guardado con éxito!`);
  }
}
