import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarSuscripcion } from './cancelar-suscripcion';

describe('CancelarSuscripcion', () => {
  let component: CancelarSuscripcion;
  let fixture: ComponentFixture<CancelarSuscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelarSuscripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelarSuscripcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
