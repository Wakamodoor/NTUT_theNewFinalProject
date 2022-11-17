import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApologizeComponent } from './apologize.component';

describe('ApologizeComponent', () => {
  let component: ApologizeComponent;
  let fixture: ComponentFixture<ApologizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApologizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApologizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
