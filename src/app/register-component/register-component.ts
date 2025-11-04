import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import {AuthService} from '../Services/auth-service';
import {RegistroRequestDTO} from '../../model/registro-request-dto.model';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css'],
  imports: [
    ReactiveFormsModule,
    RouterLink
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
    });
  }

  enviarDatos(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Formulario inválido. Revisa los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const registroData: RegistroRequestDTO = {
      nombreCompleto: this.registerForm.value.nombre,
      correoElectronico: this.registerForm.value.email,
      contraseña: this.registerForm.value.password,
      tipoUsuario: 'USER',
    };

    this.authService.registrar(registroData).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.router.navigate(['/user-panel']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.errorMessage = err.error || 'Error en el registro';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
