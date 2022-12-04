import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BertComponent } from './bert.component';

describe('BertComponent', () => {
  let component: BertComponent;
  let fixture: ComponentFixture<BertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
