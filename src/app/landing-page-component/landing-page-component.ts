import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {Navbar} from '../navbar/navbar';



@Component({
  selector: 'app-landing-page-component',
  imports: [
    RouterLink,
    MatSlideToggle,
    MatToolbar,
    MatButton,
    Navbar
  ],
  templateUrl: './landing-page-component.html',
  styleUrl: './landing-page-component.css',
})


export class LandingPageComponent {

}

