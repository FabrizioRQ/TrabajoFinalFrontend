export interface PagoDTO {
  id: number;
  monto: number;
  fechaPago: string; // ISO string
  metodoPago: string;
  estado: string;
  idUsuario: number;
}
