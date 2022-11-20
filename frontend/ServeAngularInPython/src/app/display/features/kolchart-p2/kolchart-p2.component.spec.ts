import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KolchartP2Component } from './kolchart-p2.component';

describe('KolchartP2Component', () => {
  let component: KolchartP2Component;
  let fixture: ComponentFixture<KolchartP2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KolchartP2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KolchartP2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
