import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-landing-page-component',
  templateUrl: './landing-page-component.html',
  styleUrls: ['./landing-page-component.css'],
  standalone: true,
  imports: [Navbar]
})
export class LandingPageComponent implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((s: Element) => observer.observe(s));
  }
}
