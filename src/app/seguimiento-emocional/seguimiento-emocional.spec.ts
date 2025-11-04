import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoEmocional } from './seguimiento-emocional';

describe('SeguimientoEmocional', () => {
  let component: SeguimientoEmocional;
  let fixture: ComponentFixture<SeguimientoEmocional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoEmocional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoEmocional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
