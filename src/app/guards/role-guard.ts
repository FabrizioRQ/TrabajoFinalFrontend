import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = authService.getUser(); // <- Debe devolver { role: 'ADMIN' } o { role: 'USER' }
  const expectedRole = route.data['role'];

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.role === expectedRole) {
    return true;
  }

  router.navigate(['/not-authorized']);
  return false;
};
