import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/auth-service';

@Component({
  selector: 'app-user-panel-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './user-panel-component.html',
  styleUrls: ['./user-panel-component.css']
})

export class UserPanelComponent implements OnInit {

  userName: string = '';
  userId: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.verificarUsuario();
  }

  verificarUsuario(): void {
    const user = this.authService.getUser();
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getNombreUsuario() || 'Usuario';

    console.log('🔐 === DATOS DEL USUARIO EN USER PANEL ===');
    console.log('Usuario completo:', user);
    console.log('ID del usuario:', this.userId);
    console.log('Nombre del usuario:', this.userName);
    console.log('Rol del usuario:', this.authService.getUserRole());
    console.log('Token existe:', !!this.authService.getToken());
    console.log('=========================================');

    if (!user || !this.userId) {
      console.warn('⚠️ No se encontraron datos del usuario. Redirigiendo...');
      this.logout();
    }
  }

  logout() {
    console.log('🚪 Cerrando sesión...');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
