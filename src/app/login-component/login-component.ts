import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/auth-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  enviarDatos(): void {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      const loginData = {
        correoElectronico: this.loginForm.value.email,
        contraseña: this.loginForm.value.password,
      };

      this.authService.login(loginData).subscribe({
        next: (res) => {
          console.log('✅ Login exitoso:', res);
          if (res.tipoUsuario === 'ADMIN') {
            this.router.navigate(['/admin-panel']);
          } else {
            this.router.navigate(['/user-panel']);
          }
        },
        error: (err) => {
          console.error('Error en login:', err);
          this.errorMessage = 'Correo o contraseña incorrectos. Intenta nuevamente.';
          setTimeout(() => (this.errorMessage = ''), 4000);
        },
      });
    } else {
      this.errorMessage = 'Por favor completa los campos correctamente.';
      setTimeout(() => (this.errorMessage = ''), 4000);
    }
  }
}
