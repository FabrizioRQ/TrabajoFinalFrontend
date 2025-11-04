import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvataresDesbloqueados } from './avatares-desbloqueados';

describe('AvataresDesbloqueados', () => {
  let component: AvataresDesbloqueados;
  let fixture: ComponentFixture<AvataresDesbloqueados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvataresDesbloqueados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvataresDesbloqueados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
