export interface PagoCreateDTO {
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
  usuarioId: number;
}
