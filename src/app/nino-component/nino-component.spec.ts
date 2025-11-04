import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinoComponent } from './nino-component';

describe('NinoComponent', () => {
  let component: NinoComponent;
  let fixture: ComponentFixture<NinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
