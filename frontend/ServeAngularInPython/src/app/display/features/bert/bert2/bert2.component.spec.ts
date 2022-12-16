import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bert2Component } from './bert2.component';

describe('Bert2Component', () => {
  let component: Bert2Component;
  let fixture: ComponentFixture<Bert2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bert2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bert2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
