import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendacionesIa } from './recomendaciones-ia';

describe('RecomendacionesIa', () => {
  let component: RecomendacionesIa;
  let fixture: ComponentFixture<RecomendacionesIa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionesIa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendacionesIa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
