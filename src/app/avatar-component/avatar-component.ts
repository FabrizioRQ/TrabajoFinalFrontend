// avatar-component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AvatarDto } from '../../model/avatar-dto.model';
import {AvatarService} from '../Services/avatar-service';

@Component({
  selector: 'app-avatar-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './avatar-component.html',
  styleUrls: ['./avatar-component.css']
})
export class AvatarComponent implements OnInit {
  avatarForm!: FormGroup;
  avatares: AvatarDto[] = [];
  mensaje: string = '';
  mensajeEsError: boolean = false;
  cargando: boolean = false;
  avatarSeleccionado: AvatarDto | null = null;
  modoEdicion: boolean = false;

  // Para la subida de archivos
  archivoSeleccionado: File | null = null;
  imagenPrevia: string | ArrayBuffer | null = null;
  subiendoImagen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private avatarService: AvatarService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarAvatares();
  }

  inicializarFormulario(): void {
    this.avatarForm = this.fb.group({
      nombreAvatar: ['', [Validators.required, Validators.minLength(2)]],
      apariencia: ['', Validators.required] // 👈 Aquí guardaremos la URL de la imagen
    });
  }

  cargarAvatares(): void {
    this.avatarService.obtenerTodosLosAvatares().subscribe({
      next: (avatares) => {
        this.avatares = avatares;
      },
      error: (error) => {
        console.error('Error cargando avatares:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const archivo: File = event.target.files[0];

    if (archivo) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!tiposPermitidos.includes(archivo.type)) {
        this.mostrarMensaje('⚠️ Solo se permiten archivos PNG, JPG o GIF', true);
        return;
      }

      // Validar tamaño (max 2MB)
      if (archivo.size > 2 * 1024 * 1024) {
        this.mostrarMensaje('⚠️ La imagen no debe superar los 2MB', true);
        return;
      }

      this.archivoSeleccionado = archivo;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPrevia = reader.result;
        // Guardamos la imagen temporalmente en el formulario
        this.avatarForm.patchValue({
          apariencia: reader.result as string
        });
      };
      reader.readAsDataURL(archivo);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.avatarForm.valid && !this.cargando) {
      this.cargando = true;

      try {
        let imagenUrl = this.avatarForm.value.apariencia;

        // Si hay archivo seleccionado, subirlo primero
        if (this.archivoSeleccionado) {
          this.subiendoImagen = true;
          // En un caso real, aquí subirías la imagen al servidor
          // const resultado = await this.avatarService.subirImagenAvatar(this.archivoSeleccionado).toPromise();
          // imagenUrl = resultado.url;

          // Por ahora usamos la data URL como ejemplo
          imagenUrl = this.imagenPrevia as string;
          this.subiendoImagen = false;
        }

        const avatarData: AvatarDto = {
          nombreAvatar: this.avatarForm.value.nombreAvatar,
          apariencia: imagenUrl // 👈 Guardamos la URL o data URL
        };

        if (this.modoEdicion && this.avatarSeleccionado) {
          // Modo edición
          this.avatarService.actualizarAvatar(this.avatarSeleccionado.id!, avatarData).subscribe({
            next: (response) => {
              this.mostrarMensaje('✅ Avatar actualizado exitosamente');
              this.resetFormulario();
              this.cargarAvatares();
            },
            error: (error) => this.manejarError(error)
          });
        } else {
          // Modo creación
          this.avatarService.crearAvatar(avatarData).subscribe({
            next: (response) => {
              this.mostrarMensaje('🎉 Avatar creado exitosamente');
              this.resetFormulario();
              this.cargarAvatares();
            },
            error: (error) => this.manejarError(error)
          });
        }
      } catch (error) {
        this.manejarError(error);
      }
    }
  }

  seleccionarAvatar(avatar: AvatarDto): void {
    this.avatarSeleccionado = avatar;
    this.modoEdicion = true;
    this.avatarForm.patchValue({
      nombreAvatar: avatar.nombreAvatar,
      apariencia: avatar.apariencia
    });
    this.imagenPrevia = avatar.apariencia;
  }

  eliminarAvatar(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este avatar?')) {
      this.avatarService.eliminarAvatar(id).subscribe({
        next: () => {
          this.mostrarMensaje('🗑️ Avatar eliminado exitosamente');
          this.cargarAvatares();
          if (this.avatarSeleccionado?.id === id) {
            this.resetFormulario();
          }
        },
        error: (error) => this.manejarError(error)
      });
    }
  }

  nuevoAvatar(): void {
    this.resetFormulario();
  }

  private resetFormulario(): void {
    this.avatarForm.reset();
    this.archivoSeleccionado = null;
    this.imagenPrevia = null;
    this.avatarSeleccionado = null;
    this.modoEdicion = false;
    this.cargando = false;
    this.subiendoImagen = false;
  }

  private manejarError(error: any): void {
    console.error('Error:', error);
    let mensajeError = 'Error al procesar la solicitud. Intente nuevamente.';

    if (error.error && error.error.message) {
      mensajeError = error.error.message;
    }

    this.mostrarMensaje(mensajeError, true);
    this.cargando = false;
    this.subiendoImagen = false;
  }

  private mostrarMensaje(mensaje: string, esError: boolean = false): void {
    this.mensaje = mensaje;
    this.mensajeEsError = esError;

    if (!esError) {
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    }
  }
}
