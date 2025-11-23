// forgot-password-component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RecuperacionResponse, UserService} from '../Services/user-service';


@Component({
  selector: 'app-forgot-password-component',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './forgot-password-component.html',
  styleUrl: './forgot-password-component.css',
})
export class ForgotPasswordComponent {
  recoverForm: FormGroup;
  loading: boolean = false;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  datosRecuperacion: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarDatos(): void {
    if (this.recoverForm.valid) {
      const correo = this.recoverForm.get('email')?.value;
      this.solicitarRecuperacion(correo);
    } else {
      this.mostrarMensaje('Por favor ingresa un correo electrónico válido', 'error');
    }
  }

  private solicitarRecuperacion(correo: string): void {
    this.loading = true;
    this.mensaje = '';
    this.tipoMensaje = '';
    this.datosRecuperacion = null;

    this.userService.solicitarRecuperacion(correo).subscribe({
      next: (response: RecuperacionResponse) => {
        this.loading = false;
        this.mostrarMensaje(response.message, 'success');

        // Transformar el enlace del backend al enlace del frontend
        if (response.enlace_recuperacion) {
          const token = this.extraerTokenDelEnlace(response.enlace_recuperacion);
          const enlaceFrontend = `${window.location.origin}/restablecer-contraseña?token=${token}`;

          this.datosRecuperacion = {
            ...response,
            enlace_recuperacion: enlaceFrontend,
            token: token // Guardamos el token por si acaso
          };
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en recuperación:', error);

        if (error.error && error.error.message) {
          this.mostrarMensaje(error.error.message, 'error');
        } else {
          this.mostrarMensaje('Error al procesar la solicitud. Intenta nuevamente.', 'error');
        }
      }
    });
  }

  private extraerTokenDelEnlace(enlaceBackend: string): string {
    try {
      const url = new URL(enlaceBackend);
      return url.searchParams.get('token') || '';
    } catch (error) {
      console.error('Error extrayendo token:', error);
      return '';
    }
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
  }

  copiarEnlace(): void {
    if (this.datosRecuperacion?.enlace_recuperacion) {
      navigator.clipboard.writeText(this.datosRecuperacion.enlace_recuperacion)
        .then(() => {
          // Mensaje opcional de copiado exitoso
          console.log('Enlace copiado al portapapeles');
        })
        .catch(err => {
          console.error('Error al copiar: ', err);
        });
    }
  }
}
