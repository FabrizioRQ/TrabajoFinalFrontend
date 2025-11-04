import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmocionesPorMomento } from './emociones-por-momento';

describe('EmocionesPorMomento', () => {
  let component: EmocionesPorMomento;
  let fixture: ComponentFixture<EmocionesPorMomento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmocionesPorMomento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmocionesPorMomento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
