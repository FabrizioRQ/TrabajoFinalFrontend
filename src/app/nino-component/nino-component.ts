// nino-component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NiñoDto } from '../../model/niño-dto.model';
import { AvatarDto } from '../../model/avatar-dto.model';
import { PadreDto } from '../../model/padre-dto.model';
import {NinoService} from '../Services/nino-service';
import {DatosService} from '../Services/datos.service';
import {AuthService} from '../Services/auth-service';
import {PsicologoDTO} from '../../model/psicologo-dto.model';

@Component({
  selector: 'app-nino-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './nino-component.html',
  styleUrls: ['./nino-component.css']
})
export class NinoComponent implements OnInit {
  ninoForm!: FormGroup;
  mensaje: string = '';
  mensajeEsError: boolean = false;
  cargando: boolean = false;

  // Listas para los dropdowns
  avatares: AvatarDto[] = [];
  psicologos: PsicologoDTO[] = [];
  padres: PadreDto[] = [];

  // Usuario actual
  usuarioActual: any = null;

  constructor(
    private fb: FormBuilder,
    private ninoService: NinoService,
    private datosService: DatosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarioActual();
    this.cargarListas();
  }

  inicializarFormulario(): void {
    this.ninoForm = this.fb.group({
      fechaNacimiento: ['', [Validators.required]],
      idAvatar: ['', [Validators.required]],
      idPsicologo: [''],
      idPadre: ['', [Validators.required]]
    });
  }

  cargarUsuarioActual(): void {
    this.usuarioActual = this.authService.getUser();
    console.log('Usuario actual:', this.usuarioActual);

    if (!this.usuarioActual || !this.authService.getUserId()) {
      this.mostrarMensaje('❌ No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.', true);
      this.router.navigate(['/login']);
    }
  }

  cargarListas(): void {
    this.cargando = true;

    // Cargar avatares
    this.datosService.obtenerAvatares().subscribe({
      next: (avatares) => {
        this.avatares = avatares;
        console.log('Avatares cargados:', avatares);
      },
      error: (error) => {
        console.error('Error cargando avatares:', error);
        this.mostrarMensaje('Error cargando la lista de avatares', true);
      }
    });

    // Cargar psicólogos
    this.datosService.obtenerPsicologos().subscribe({
      next: (psicologos) => {
        this.psicologos = psicologos;
        console.log('Psicólogos cargados:', psicologos);
      },
      error: (error) => {
        console.error('Error cargando psicólogos:', error);
        this.mostrarMensaje('Error cargando la lista de psicólogos', true);
      }
    });

    // Cargar padres
    this.datosService.obtenerPadres().subscribe({
      next: (padres) => {
        this.padres = padres;
        console.log('Padres cargados:', padres);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando padres:', error);
        this.mostrarMensaje('Error cargando la lista de padres', true);
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.ninoForm.valid && !this.cargando && this.usuarioActual) {
      this.cargando = true;
      this.mensaje = 'Registrando niño...';

      const formData = this.ninoForm.value;
      const userId = this.authService.getUserId();

      console.log('📝 Datos del formulario:', formData);

      const ninoData: NiñoDto = {
        fechaNacimiento: formData.fechaNacimiento,
        idUsuario: userId!,
        idAvatar: formData.idAvatar,
        idPsicologo: formData.idPsicologo || undefined,
        idPadre: formData.idPadre
      };

      this.ninoService.crearNino(ninoData).subscribe({
        next: (response) => {
          console.log('✅ Niño registrado exitosamente:', response);
          this.mostrarMensaje('🎉 ¡Niño registrado exitosamente!');
          this.ninoForm.reset();
        },
        error: (error) => {
          console.error('❌ Error al registrar niño:', error);
          let mensajeError = 'Error al registrar el niño. Intente nuevamente.';

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
      this.mostrarMensaje('⚠️ Por favor, complete todos los campos obligatorios.', true);
      this.ninoForm.markAllAsTouched();
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

  // Helper para obtener nombre del avatar
  getNombreAvatar(id: number): string {
    const avatar = this.avatares.find(a => a.id === id);
    return avatar ? avatar.nombreAvatar : 'Avatar no encontrado';
  }

  // Helper para obtener nombre del padre
  getNombrePadre(id: number): string {
    const padre = this.padres.find(p => p.id === id);
    return padre ? `${padre.nombre} ${padre.apellido}` : 'Padre no encontrado';
  }

  // Helper para obtener info del psicólogo
  getInfoPsicologo(id: number): string {
    const psicologo = this.psicologos.find(p => p.id === id);
    return psicologo ? `${psicologo.especialidad} - ${psicologo.numeroColegiatura}` : 'Psicólogo no encontrado';
  }
}
