import { Role } from './role.model';

export interface Usuario {
  id: number;
  correoElectronico: string;
  contraseña: string;
  tipoUsuario: string;
  estado: string;
  nombreCompleto: string;
  roles: Role[];
}
