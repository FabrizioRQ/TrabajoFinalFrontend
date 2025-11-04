import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmociones } from './registro-emociones';

describe('RegistroEmociones', () => {
  let component: RegistroEmociones;
  let fixture: ComponentFixture<RegistroEmociones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroEmociones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEmociones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
