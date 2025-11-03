import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel-component',
  imports: [],
  templateUrl: './admin-panel-component.html',
  styleUrl: './admin-panel-component.css',
})
export class AdminPanelComponent {
  openModule(nombre: string) {
    console.log('Abriendo módulo:', nombre);
    // Aquí luego rediriges con router.navigate([`/admin/${nombre}`])
  }
}
