import {Usuario} from './usuario.model';

export interface PagoDto {
  id: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
  idUsuario: Usuario;
}
