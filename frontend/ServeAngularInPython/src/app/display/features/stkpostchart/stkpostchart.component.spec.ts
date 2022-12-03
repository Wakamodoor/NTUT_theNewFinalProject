import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StkpostchartComponent } from './stkpostchart.component';

describe('StkpostchartComponent', () => {
  let component: StkpostchartComponent;
  let fixture: ComponentFixture<StkpostchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StkpostchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StkpostchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
