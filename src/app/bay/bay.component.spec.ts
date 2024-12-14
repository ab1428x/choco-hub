import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayComponent } from './bay.component';

describe('BayComponent', () => {
  let component: BayComponent;
  let fixture: ComponentFixture<BayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
