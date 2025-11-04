import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';

// Definición de una interfaz para la estructura de un método de pago
interface MetodoPago {
  id: number;
  tipo: 'Billetera Digital' | 'Tarjeta' | 'Cuenta bancaria';
  detalle: string; // Ej: "••• •••• 1234" o nombre de billetera
  iconoClase: string; // Para usar un icono representativo
  esPredeterminado: boolean;
}

@Component({
  selector: 'app-metodos-pago',
  standalone: true, // Componente standalone
  imports: [CommonModule, NgFor, NgIf, NgClass],
  templateUrl: './metodos-pago.html',
  styleUrl: './metodos-pago.css',
})
export class MetodosPago {
  // Datos de ejemplo para los métodos de pago
  metodos: MetodoPago[] = [
    {
      id: 1,
      tipo: 'Billetera Digital',
      detalle: 'Billetera Digital',
      iconoClase: 'wallet-icon', // Icono de billetera
      esPredeterminado: true,
    },
    {
      id: 2,
      tipo: 'Tarjeta',
      detalle: '•••• •••• •••• 1234',
      iconoClase: 'card-icon', // Icono de tarjeta
      esPredeterminado: false,
    },
    {
      id: 3,
      tipo: 'Cuenta bancaria',
      detalle: 'Cuenta bancaria',
      iconoClase: 'bank-icon', // Icono de banco
      esPredeterminado: false,
    },
  ];

  constructor() { }

  /**
   * Simula la adición de un nuevo método de pago.
   */
  anadirMetodo(): void {
    console.log('Abriendo modal para añadir método de pago...');
    // Lógica para abrir un modal o navegar a un formulario de adición
    alert('Función para añadir un nuevo método de pago.');
  }

  /**
   * Elimina un método de pago.
   */
  eliminarMetodo(id: number): void {
    const metodoAEliminar = this.metodos.find(m => m.id === id);
    if (metodoAEliminar && confirm(`¿Estás seguro de que quieres eliminar ${metodoAEliminar.tipo}?`)) {
      this.metodos = this.metodos.filter(m => m.id !== id);
      console.log(`Método con ID ${id} eliminado.`);
      // Lógica adicional si se elimina el método predeterminado
      if (metodoAEliminar.esPredeterminado && this.metodos.length > 0) {
        this.establecerPredeterminado(this.metodos[0].id);
      }
    }
  }

  /**
   * Marca un método como predeterminado.
   */
  establecerPredeterminado(id: number): void {
    this.metodos.forEach(m => {
      m.esPredeterminado = (m.id === id);
    });
    console.log(`Método con ID ${id} establecido como predeterminado.`);
    // Aquí iría la llamada a la API para guardar la preferencia.
  }
}
