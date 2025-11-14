export interface MetodoPagoDTO {
  id: number;
  tipo: string; // "tarjeta_credito", "billetera_digital", "transferencia"
  ultimosDigitos: string; // "****1234"
  predeterminado: boolean;
  estado: string; // "ACTIVO", "INACTIVO"
  usuarioId: number;
  fechaCreacion: string; // ISO string
}
