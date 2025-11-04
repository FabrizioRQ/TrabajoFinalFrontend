import { Component } from '@angular/core';
// Importamos CommonModule para usar *ngFor, *ngIf, y NgClass
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';

// Definición de una interfaz para la estructura de un pago
interface HistorialPago {
  id: string;
  fecha: string;
  monto: string;
  estado: 'Completado' | 'Rechazado' | 'Pendiente';
}

@Component({
  selector: 'app-historial-pagos',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.css',
})
export class HistorialPagos {

  historial: HistorialPago[] = [
    {
      id: 'inv-001',
      fecha: '15/04/2024',
      monto: '12,99',
      estado: 'Completado',
    },
    {
      id: 'inv-002',
      fecha: '15/03/2024',
      monto: '12,99',
      estado: 'Completado',
    },
    {
      id: 'inv-003',
      fecha: '15/02/2024',
      monto: '12,99',
      estado: 'Rechazado',
    },
    {
      id: 'inv-004',
      fecha: '15/01/2024',
      monto: '12,99',
      estado: 'Completado',
    }
  ];

  constructor() { }


  descargarFacturaGeneral(): void {
    console.log('Descargando factura general...');
    alert('Función para descargar la factura principal.');
  }


  descargarRecibo(pagoId: string): void {
    console.log(`Descargando recibo para el pago: ${pagoId}`);
    alert(`Descargando recibo ${pagoId}...`);
  }
}
