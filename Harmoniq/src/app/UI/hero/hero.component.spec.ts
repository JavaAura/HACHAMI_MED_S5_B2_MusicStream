import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the first quote', () => {
    expect(component.currentSlide).toBe(0);
    expect(component.quotes.length).toBeGreaterThan(0);
  });

  it('should move to the next slide', () => {
    const initialSlide = component.currentSlide;
    component.nextSlide();
    expect(component.currentSlide).toBe((initialSlide + 1) % component.quotes.length);
  });

  it('should move to the previous slide', () => {
    component.currentSlide = 1;
    component.prevSlide();
    expect(component.currentSlide).toBe(0);
  });

  it('should wrap around to the last slide when going back from the first slide', () => {
    component.currentSlide = 0;
    component.prevSlide();
    expect(component.currentSlide).toBe(component.quotes.length - 1);
  });

  it('should wrap around to the first slide when going forward from the last slide', () => {
    component.currentSlide = component.quotes.length - 1;
    component.nextSlide();
    expect(component.currentSlide).toBe(0);
  });

  it('should auto-slide after 6 seconds', fakeAsync(() => {
    const initialSlide = component.currentSlide;
    tick(6000);
    expect(component.currentSlide).toBe((initialSlide + 1) % component.quotes.length);
    discardPeriodicTasks();
  }));

  it('should stop auto-sliding on component destroy', fakeAsync(() => {
    const initialSlide = component.currentSlide;
    component.ngOnDestroy();
    tick(6000);
    expect(component.currentSlide).toBe(initialSlide);
  }));

  it('should render the current quote', () => {
    fixture.detectChanges();
    const quoteElement = fixture.debugElement.query(By.css('.quote-text'));
    expect(quoteElement).toBeTruthy();
    expect(quoteElement.nativeElement.textContent).toContain(component.quotes[0].text);
  });

  it('should render the current author', () => {
    fixture.detectChanges();
    const authorElement = fixture.debugElement.query(By.css('.quote-author'));
    expect(authorElement).toBeTruthy();
    expect(authorElement.nativeElement.textContent).toContain(component.quotes[0].author);
  });

  it('should render the current author role if available', () => {
    fixture.detectChanges();
    const roleElement = fixture.debugElement.query(By.css('.quote-role'));
    expect(roleElement).toBeTruthy();
    expect(roleElement.nativeElement.textContent).toContain(component.quotes[0].role);
  });

  it('should set the background image', () => {
    fixture.detectChanges();
    const heroElement = fixture.debugElement.query(By.css('.hero'));
    expect(heroElement).toBeTruthy();
    expect(heroElement.styles['backgroundImage']).toContain(component.quotes[0].backgroundImage);
  });
});

