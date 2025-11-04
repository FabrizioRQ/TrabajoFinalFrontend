import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoEmocional } from './monitoreo-emocional';

describe('MonitoreoEmocional', () => {
  let component: MonitoreoEmocional;
  let fixture: ComponentFixture<MonitoreoEmocional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoreoEmocional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoreoEmocional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
