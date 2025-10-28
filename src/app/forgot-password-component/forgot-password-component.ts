import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password-component',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password-component.html',
  styleUrl: './forgot-password-component.css',
})
export class ForgotPasswordComponent {
  recoverForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarDatos(): void {
    if (this.recoverForm.valid) {
      console.log('Correo para recuperación:', this.recoverForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
