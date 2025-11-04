import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioEmocional } from './diario-emocional';

describe('DiarioEmocional', () => {
  let component: DiarioEmocional;
  let fixture: ComponentFixture<DiarioEmocional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiarioEmocional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiarioEmocional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
