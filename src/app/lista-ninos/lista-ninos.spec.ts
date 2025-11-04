import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNinos } from './lista-ninos';

describe('ListaNinos', () => {
  let component: ListaNinos;
  let fixture: ComponentFixture<ListaNinos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaNinos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaNinos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
