import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrackModalComponent } from './new-track-modal.component';

describe('NewTrackModalComponent', () => {
  let component: NewTrackModalComponent;
  let fixture: ComponentFixture<NewTrackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTrackModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
