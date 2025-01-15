import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AudioPlayerComponent } from './UI/audio-player/audio-player.component';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let mockStore: MockStore;
  let actions$: Observable<any>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        AudioPlayerComponent
      ],
      providers: [
        provideMockStore({}),
        provideMockActions(() => actions$),
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockStore = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Create a mock form group with the 'coverImage' control
    const mockForm = formBuilder.group({
      coverImage: ['']
    });

    // Assign the mock form to the component or relevant child component
    // This is an example, adjust according to your actual component structure
    (component as any).form = mockForm;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Harmoniq'`, () => {
    expect(component.title).toEqual('Harmoniq');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Harmoniq');
  });

  it('should have router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

 
});

