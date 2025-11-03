import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [
    MatButton,
    MatToolbar,
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}
