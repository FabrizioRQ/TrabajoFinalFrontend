import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmocionesPorEvento } from './emociones-por-evento';

describe('EmocionesPorEvento', () => {
  let component: EmocionesPorEvento;
  let fixture: ComponentFixture<EmocionesPorEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmocionesPorEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmocionesPorEvento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
