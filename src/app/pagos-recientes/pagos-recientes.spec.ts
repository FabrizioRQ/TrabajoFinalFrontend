import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosRecientes } from './pagos-recientes';

describe('PagosRecientes', () => {
  let component: PagosRecientes;
  let fixture: ComponentFixture<PagosRecientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosRecientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosRecientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
