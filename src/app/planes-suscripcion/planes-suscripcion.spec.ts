import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesSuscripcion } from './planes-suscripcion';

describe('PlanesSuscripcion', () => {
  let component: PlanesSuscripcion;
  let fixture: ComponentFixture<PlanesSuscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanesSuscripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanesSuscripcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
