import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-padre-component',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './padre-component.html',
  styleUrl: './padre-component.css',
})
export class PadreComponent  implements OnInit {
  registroForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      relacion: ['padre', Validators.required]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      console.log(this.registroForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
