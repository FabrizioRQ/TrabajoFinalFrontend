import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { RegisterComponent } from './register-component/register-component';
import { ForgotPasswordComponent } from './forgot-password-component/forgot-password-component';
import { LandingPageComponent } from './landing-page-component/landing-page-component';
import { AdminPanelComponent } from './admin-panel-component/admin-panel-component';
import { UserPanelComponent } from './user-panel-component/user-panel-component';
import { NotAuthorizedComponent } from './not-authorized-component/not-authorized-component';
import {roleGuard} from './guards/role-guard';
import {PsicologoComponent} from './psicologo-component/psicologo-component';
import {AvatarComponent} from './avatar-component/avatar-component';
import {PadreComponent} from './padre-component/padre-component';
import {NinoComponent} from './nino-component/nino-component';
import {ListaNinos} from './lista-ninos/lista-ninos';
import {Perfil} from './perfil/perfil';
import {ListaPsicologos} from './lista-psicologos/lista-psicologos';
import {MonitoreoEmocional} from './monitoreo-emocional/monitoreo-emocional';
import {RecomendacionesIa} from './recomendaciones-ia/recomendaciones-ia';
import {RegistroEmociones} from './registro-emociones/registro-emociones';
import {SeguimientoEmocional} from './seguimiento-emocional/seguimiento-emocional';
import {EmocionesPorMomento} from './emociones-por-momento/emociones-por-momento';
import {EmocionesPorEvento} from './emociones-por-evento/emociones-por-evento';
import {DiarioEmocional} from './diario-emocional/diario-emocional';
import {PlanesSuscripcion} from './planes-suscripcion/planes-suscripcion';
import {MetodosPago} from './metodos-pago/metodos-pago';
import {CancelarSuscripcion} from './cancelar-suscripcion/cancelar-suscripcion';
import {HistorialPagos} from './historial-pagos/historial-pagos';
import {PagosRecientes} from './pagos-recientes/pagos-recientes';
import {ActividadesJuego} from './actividades-juego/actividades-juego';
import {AvataresDesbloqueados} from './avatares-desbloqueados/avatares-desbloqueados';


export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recuperacion', component: ForgotPasswordComponent },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'user-panel',
    component: UserPanelComponent,
    canActivate: [roleGuard],
    data: { role: 'USER' },
  },

  // Rutas de gestión de usuarios y perfiles
  { path: 'psicologo', component: PsicologoComponent },
  { path: 'avatar', component: AvatarComponent },
  { path: 'padre', component: PadreComponent },
  { path: 'perfil', component: Perfil },
  { path: 'nino', component: NinoComponent },
  { path: 'lista-ninos', component: ListaNinos },
  { path: 'lista-psicologos', component: ListaPsicologos },

  // Rutas de emociones y monitoreo
  { path: 'monitoreo-emocional', component: MonitoreoEmocional },
  { path: 'recomendaciones-ia', component: RecomendacionesIa },
  { path: 'registro-emociones', component: RegistroEmociones },
  { path: 'seguimiento-emocional', component: SeguimientoEmocional },
  { path: 'emociones-por-momento', component: EmocionesPorMomento },
  { path: 'emociones-por-evento', component: EmocionesPorEvento },
  { path: 'diario-emocional', component: DiarioEmocional },


  // Rutas de suscripción y pagos
  { path: 'planes-suscripcion', component: PlanesSuscripcion },
  { path: 'metodos-pago', component: MetodosPago },
  { path: 'cancelar-suscripcion', component: CancelarSuscripcion },
  { path: 'historial-pagos', component: HistorialPagos },
  { path: 'pagos-recientes', component: PagosRecientes },

  // Rutas de juegos y avatares
  { path: 'actividades-juego', component: ActividadesJuego },
  { path: 'avatares-desbloqueados', component: AvataresDesbloqueados },


  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: 'landing' },
];
