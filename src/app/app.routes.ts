import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { RegisterComponent } from './register-component/register-component';
import { ForgotPasswordComponent } from './forgot-password-component/forgot-password-component';
import { LandingPageComponent } from './landing-page-component/landing-page-component';
import { AdminPanelComponent } from './admin-panel-component/admin-panel-component';
import { UserPanelComponent } from './user-panel-component/user-panel-component';
import { NotAuthorizedComponent } from './not-authorized-component/not-authorized-component';
import { roleGuard } from './guards/role-guard';

import { PsicologoComponent } from './psicologo-component/psicologo-component';
import { AvatarComponent } from './avatar-component/avatar-component';
import { PadreComponent } from './padre-component/padre-component';
import { NinoComponent } from './nino-component/nino-component';
import { ListaNinos } from './lista-ninos/lista-ninos';
import { Perfil } from './perfil/perfil';
import { ListaPsicologos } from './lista-psicologos/lista-psicologos';
import { MonitoreoEmocional } from './monitoreo-emocional/monitoreo-emocional';
import { RecomendacionesIa } from './recomendaciones-ia/recomendaciones-ia';
import { RegistroEmociones } from './registro-emociones/registro-emociones';
import { SeguimientoEmocional } from './seguimiento-emocional/seguimiento-emocional';
import { EmocionesPorMomento } from './emociones-por-momento/emociones-por-momento';
import { EmocionesPorEvento } from './emociones-por-evento/emociones-por-evento';
import { DiarioEmocional } from './diario-emocional/diario-emocional';
import { PlanesSuscripcion } from './planes-suscripcion/planes-suscripcion';
import { MetodosPago } from './metodos-pago/metodos-pago';
import { CancelarSuscripcion } from './cancelar-suscripcion/cancelar-suscripcion';
import { HistorialPagos } from './historial-pagos/historial-pagos';
import { PagosRecientes } from './pagos-recientes/pagos-recientes';
import { ActividadesJuego } from './actividades-juego/actividades-juego';
import { AvataresDesbloqueados } from './avatares-desbloqueados/avatares-desbloqueados';
import {authGuard} from './guards/auth-guard';
import {ListaUsuarios} from './lista-usuarios/lista-usuarios';
import {ListarPadres} from './listar-padres/listar-padres';
import {ConfirmacionPago} from './confirmacion-pago/confirmacion-pago';
import {ResetPasswordComponent} from './reset-password-component/reset-password-component';
import {RegistroConfirmado} from './registro-confirmado/registro-confirmado';
import {PsicologoPanel} from './psicologo-panel/psicologo-panel';
import {ListarEmociones} from './listar-emociones/listar-emociones';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recuperacion', component: ForgotPasswordComponent },
  { path: 'registro-confirmado', component: RegistroConfirmado },
  { path: 'restablecer-contraseña', component: ResetPasswordComponent },
  { path: 'psicologo-panel', component: PsicologoPanel },

  // PANEL ADMINISTRADOR CON SUS RUTAS HIJAS
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'psicologo', component: PsicologoComponent },
      { path: 'padre', component: PadreComponent },
      { path: 'nino', component: NinoComponent },
      { path: 'perfil', component: Perfil },
      { path: 'lista-ninos', component: ListaNinos },
      { path: 'lista-psicologos', component: ListaPsicologos },
      { path: 'lista-padres', component: ListarPadres },
      { path: 'lista-emociones', component: ListarEmociones },
      { path: 'avatar', component: AvatarComponent },
      { path: 'monitoreo-emocional', component: MonitoreoEmocional },
      { path: 'recomendaciones-ia', component: RecomendacionesIa },
      { path: 'seguimiento-emocional', component: SeguimientoEmocional },
      { path: 'emociones-por-momento', component: EmocionesPorMomento },
      { path: 'emociones-por-evento', component: EmocionesPorEvento },
      { path: 'lista-usuarios', component: ListaUsuarios },
      { path: 'avatares-desbloqueados', component: AvataresDesbloqueados },
      { path: 'historial-pagos', component: HistorialPagos },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    ],
  },

  // PANEL EL USER CON SUS RUTAS HIJAS
  {
    path: 'user-panel',
    component: UserPanelComponent,
    canActivate: [authGuard,roleGuard],
    data: { role: 'USER' },
    children: [
      { path: 'padre', component: PadreComponent },
      { path: 'nino', component: NinoComponent },
      { path: 'emociones-por-momento', component: EmocionesPorMomento },
      { path: 'seguimiento-emocional', component: SeguimientoEmocional },
      { path: 'recomendaciones-ia', component: RecomendacionesIa },
      { path: 'monitoreo-emocional', component: MonitoreoEmocional },
      { path: 'planes-suscripcion', component: PlanesSuscripcion },
      { path: 'metodos-pago', component: MetodosPago },
      { path: 'cancelar-suscripcion', component: CancelarSuscripcion },
      { path: 'pagos-recientes', component: PagosRecientes },
      { path: 'registro-emociones', component: RegistroEmociones },
      { path: 'diario-emocional', component: DiarioEmocional },
      { path: 'actividades-juego', component: ActividadesJuego },
      { path: 'confirmacion', component: ConfirmacionPago },
      { path: 'perfil', component: Perfil },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    ],
  },

  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: 'landing' },
];
