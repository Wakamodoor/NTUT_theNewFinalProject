import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodatasnakebarComponent } from './nodatasnakebar.component';

describe('NodatasnakebarComponent', () => {
  let component: NodatasnakebarComponent;
  let fixture: ComponentFixture<NodatasnakebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodatasnakebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodatasnakebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
