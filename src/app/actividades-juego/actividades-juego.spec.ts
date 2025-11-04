import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesJuego } from './actividades-juego';

describe('ActividadesJuego', () => {
  let component: ActividadesJuego;
  let fixture: ComponentFixture<ActividadesJuego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesJuego]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesJuego);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
