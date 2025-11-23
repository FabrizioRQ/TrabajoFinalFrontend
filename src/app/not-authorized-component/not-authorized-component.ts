import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized-component',
  templateUrl: './not-authorized-component.html',
  styleUrls: ['./not-authorized-component.css']
})
export class NotAuthorizedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('matrixCanvas') matrixCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('binaryRain') binaryRain!: ElementRef<HTMLDivElement>;

  private matrixInterval: any;
  private binaryElements: HTMLElement[] = [];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.createMatrixEffect();
    this.createBinaryRain();
  }

  ngOnDestroy(): void {
    // Limpiar intervalos y elementos
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
    }

    this.binaryElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  }

  private createMatrixEffect(): void {
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    this.matrixInterval = setInterval(draw, 33);
  }

  private createBinaryRain(): void {
    const container = this.binaryRain.nativeElement;
    const binaryChars = "01";

    for (let i = 0; i < 50; i++) {
      const binary = document.createElement('div');
      binary.textContent = binaryChars.charAt(Math.floor(Math.random() * binaryChars.length));
      binary.style.position = 'absolute';
      binary.style.color = 'rgba(0, 255, 0, 0.7)';
      binary.style.fontSize = (Math.random() * 20 + 10) + 'px';
      binary.style.fontFamily = 'monospace';
      binary.style.left = Math.random() * 100 + 'vw';
      binary.style.top = Math.random() * 100 + 'vh';
      binary.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;

      container.appendChild(binary);
      this.binaryElements.push(binary);
    }
  }

  redirectToHome(): void {
    // Redirigir a la página principal
    this.router.navigate(['/']);
  }
}
