import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KolchartP1Component } from './kolchart-p1.component';

describe('KolchartP1Component', () => {
  let component: KolchartP1Component;
  let fixture: ComponentFixture<KolchartP1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KolchartP1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KolchartP1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
