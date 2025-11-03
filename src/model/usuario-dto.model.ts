export interface UsuarioDTO {
  id: number;
  correoElectronico: string;
  contraseña?: string;
  tipoUsuario: string;
  nombreCompleto: string;
}
