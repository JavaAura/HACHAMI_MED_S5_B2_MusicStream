import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackdetailsComponent } from './trackdetails.component';

describe('TrackdetailsComponent', () => {
  let component: TrackdetailsComponent;
  let fixture: ComponentFixture<TrackdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
