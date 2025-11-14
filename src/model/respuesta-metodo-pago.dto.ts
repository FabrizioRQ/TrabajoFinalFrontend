import {MetodoPagoDTO} from './MetodoPagoDTO';

export interface RespuestaMetodoPagoDTO {
  exito: boolean;
  mensaje: string;
  metodoPago: MetodoPagoDTO;
}
