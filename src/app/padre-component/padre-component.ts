import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PadreDto } from '../../model/padre-dto.model';
import {PadreService} from '../Services/padre-service';
import {AuthService} from '../Services/auth-service';

@Component({
  selector: 'app-padre-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './padre-component.html',
  styleUrls: ['./padre-component.css']
})
export class PadreComponent implements OnInit {
  registroForm!: FormGroup;
  mensaje: string = '';
  mensajeEsError: boolean = false;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private padreService: PadreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.registroForm.valid && !this.cargando) {
      this.cargando = true;
      this.mensaje = 'Registrando...';

      const formData = this.registroForm.value;

      console.log('📝 Datos del formulario:', formData);

      const padreData = {
        nombre: formData.nombre,
        apellido: formData.apellido
      };

      this.padreService.crearPadre(padreData).subscribe({
        next: (response) => {
          console.log('✅ Padre registrado exitosamente:', response);
          this.mostrarMensaje('🎉 ¡Registrado como padre exitosamente!');
          this.registroForm.reset();
          this.cargando = false;
          // 👇 Quitamos el setTimeout que redirige automáticamente
        },
        error: (error) => {
          console.error('❌ Error al registrar padre:', error);
          let mensajeError = 'Error al registrar. Intente nuevamente.';

          if (error.error && error.error.message) {
            mensajeError = error.error.message;
          } else if (error.status === 0) {
            mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión.';
          }

          this.mostrarMensaje(mensajeError, true);
        },
        complete: () => {
          this.cargando = false;
        }
      });
    } else {
      this.mostrarMensaje('⚠️ Por favor, complete todos los campos correctamente.', true);
    }
  }

  private mostrarMensaje(mensaje: string, esError: boolean = false): void {
    this.mensaje = mensaje;
    this.mensajeEsError = esError;
    this.cargando = false;

    if (!esError) {
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    }
  }
}
