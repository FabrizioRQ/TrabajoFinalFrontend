import { Component } from '@angular/core';

interface EmotionItem {
  question: string;
  answer: string;
  tag: 'success' | 'support' | 'warning' | 'error';
  label: string;
}

@Component({
  selector: 'app-seguimiento-emocional',
  imports: [],
  templateUrl: './seguimiento-emocional.html',
  styleUrl: './seguimiento-emocional.css',
})
export class SeguimientoEmocional {
  emotions: EmotionItem[] = [
    {
      question: '¿Cómo te sentiste hoy?',
      answer: 'Me sentí bastante bien.',
      tag: 'success',
      label: 'Feliz'
    },
    {
      question: '¿Qué te hizo sentir así?',
      answer: 'Pasé tiempo con mis amigos.',
      tag: 'support',
      label: 'Ansioso'
    },
    {
      question: '¿Cómo te sentiste después de la reunión?',
      answer: 'Algo nervioso.',
      tag: 'support',
      label: 'Ansioso'
    }
  ];
}
