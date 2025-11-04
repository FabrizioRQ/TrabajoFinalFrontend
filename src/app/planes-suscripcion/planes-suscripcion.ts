import { Component } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common'; // NgFor y NgClass son útiles aquí

// Definición de una interfaz para la estructura de un plan de suscripción
interface PlanSuscripcion {
  id: string;
  nombre: string;
  precio: string; // Puede ser un string para formatos como "9,99/mes"
  caracteristicas: string[];
  isDestacado?: boolean; // Para resaltar planes como Gold o Platinum
  colorClase?: string; // Para aplicar estilos específicos basados en la paleta
}

@Component({
  selector: 'app-planes-suscripcion',
  standalone: true, // Componente standalone
  imports: [CommonModule, NgFor, NgClass], // Incluimos NgFor para iterar y NgClass para estilos condicionales
  templateUrl: './planes-suscripcion.html',
  styleUrl: './planes-suscripcion.css',
})
export class PlanesSuscripcion {
  // Datos de los planes de suscripción
  planes: PlanSuscripcion[] = [
    {
      id: 'standard',
      nombre: 'Standard',
      precio: '9,99/mes',
      caracteristicas: ['Característica 1', 'Característica 2', 'Característica 3'],
      isDestacado: false,
      colorClase: 'standard' // Usaremos esto para los estilos
    },
    {
      id: 'vip',
      nombre: 'VIP',
      precio: '19,99/mes',
      caracteristicas: ['Característica 1', 'Característica 2', 'Característica 3'],
      isDestacado: false,
      colorClase: 'vip'
    },
    {
      id: 'gold',
      nombre: 'Gold',
      precio: '29,99/mes',
      caracteristicas: ['Característica 1', 'Característica 2', 'Característica 3'],
      isDestacado: true, // Este plan está "destacado" en el mockup
      colorClase: 'gold'
    },
    {
      id: 'platinum',
      nombre: 'Platinum',
      precio: '49,99/mes',
      caracteristicas: ['Característica 1', 'Característica 2', 'Característica 3'],
      isDestacado: true, // Y este también
      colorClase: 'platinum'
    }
  ];

  constructor() { }

  // Método para manejar la selección de un plan (por ahora, solo un log)
  seleccionarPlan(planId: string): void {
    console.log(`Plan seleccionado: ${planId}`);
    // Aquí podrías implementar la lógica para navegar, abrir un modal de pago, etc.
    alert(`Has seleccionado el plan ${planId.toUpperCase()}!`);
  }

  // Método para manejar la acción de omitir
  omitirSeleccion(): void {
    console.log('Selección de plan omitida.');
    // Aquí podrías implementar la lógica para navegar a otra sección
    alert('Has omitido la selección de planes.');
  }
}
