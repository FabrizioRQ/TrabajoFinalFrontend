// reset-password-component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {UserService} from '../Services/user-service';


@Component({
  selector: 'app-reset-password-component',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  loading: boolean = false;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  passwordVisible: { [key: string]: boolean } = {
    nuevaContraseña: false,
    confirmarContraseña: false
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.resetForm = this.fb.group({
      nuevaContraseña: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmarContraseña: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.mostrarMensaje('Token no válido o faltante. Por favor solicita un nuevo enlace de recuperación.', 'error');
      }
    });
  }

  enviarDatos(): void {
    if (this.resetForm.valid && this.token) {
      const nuevaContraseña = this.resetForm.get('nuevaContraseña')?.value;
      const confirmarContraseña = this.resetForm.get('confirmarContraseña')?.value;

      // Validar que las contraseñas coincidan
      if (nuevaContraseña !== confirmarContraseña) {
        this.mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
      }

      // Validar fortaleza de contraseña
      if (!this.validarFortalezaContraseña(nuevaContraseña)) {
        this.mostrarMensaje('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número', 'error');
        return;
      }

      this.restablecerContraseña(nuevaContraseña);
    } else {
      this.mostrarMensaje('Por favor completa todos los campos correctamente', 'error');
    }
  }

  private validarFortalezaContraseña(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  private restablecerContraseña(nuevaContraseña: string): void {
    this.loading = true;
    this.mensaje = '';
    this.tipoMensaje = '';

    this.userService.restablecerContraseña(this.token, nuevaContraseña).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.mostrarMensaje('¡Contraseña restablecida exitosamente! Serás redirigido al login en 5 segundos.', 'success');
          // Redirigir después de 5 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        } else {
          this.mostrarMensaje(response.message || 'No se pudo restablecer la contraseña. Token inválido o expirado.', 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al restablecer:', error);
        if (error.error && error.error.message) {
          this.mostrarMensaje(error.error.message, 'error');
        } else {
          this.mostrarMensaje('Error al restablecer la contraseña. Por favor intenta nuevamente.', 'error');
        }
      }
    });
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
  }

  togglePasswordVisibility(field: string): void {
    this.passwordVisible[field] = !this.passwordVisible[field];
  }

  getPasswordFieldType(field: string): string {
    return this.passwordVisible[field] ? 'text' : 'password';
  }
}
