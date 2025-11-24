import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEmociones } from './listar-emociones';

describe('ListarEmociones', () => {
  let component: ListarEmociones;
  let fixture: ComponentFixture<ListarEmociones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEmociones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarEmociones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
