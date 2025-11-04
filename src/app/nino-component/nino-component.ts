import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-nino-component',
  imports: [
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './nino-component.html',
  styleUrl: './nino-component.css',
})
export class NinoComponent implements OnInit {
  ninoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ninoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(6)]],
      fecha: [''],
      genero: [''],
      notas: ['']
    });
  }

  get nombre() {
    return this.ninoForm.get('nombre')!;
  }

  onSubmit() {
    if (this.ninoForm.valid) {
      console.log(this.ninoForm.value);
      // Aquí va tu llamado a API
    } else {
      this.ninoForm.markAllAsTouched(); // Marca campos para mostrar errores
    }
  }
}
