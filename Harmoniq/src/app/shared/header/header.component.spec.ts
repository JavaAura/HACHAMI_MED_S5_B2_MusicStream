import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { NewTrackModalComponent } from '../../UI/new-track-modal/new-track-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../service/search/search.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let searchService: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['updateSearchTerm']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NewTrackModalComponent, RouterTestingModule, FormsModule],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy }
      ]
    }).compileComponents();

    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle search visibility', () => {
    expect(component.isSearchVisible).toBeFalse();
    component.toggleSearch();
    expect(component.isSearchVisible).toBeTrue();
    component.toggleSearch();
    expect(component.isSearchVisible).toBeFalse();
  });

  it('should perform search after debounce time', fakeAsync(() => {
    const searchTerm = 'test search';
    component.searchTerm = searchTerm;
    component.onSearch();
    tick(300);
    expect(searchService.updateSearchTerm).toHaveBeenCalledWith(searchTerm);
  }));

  it('should not perform search before debounce time', fakeAsync(() => {
    const searchTerm = 'test search';
    component.searchTerm = searchTerm;
    component.onSearch();
    tick(299);
    expect(searchService.updateSearchTerm).not.toHaveBeenCalled();
  }));

  it('should open new track modal', () => {
    const modalSpy = jasmine.createSpyObj('HTMLDialogElement', ['showModal']);
    spyOn(document, 'getElementById').and.returnValue(modalSpy);
    component.openNewTrackModal();
    expect(modalSpy.showModal).toHaveBeenCalled();
  });

  it('should toggle theme', () => {
    const themeManagerSpy = jasmine.createSpyObj('ThemeManager', ['toggleTheme']);
    (window as any).ThemeManager = themeManagerSpy;
    component.toggleTheme();
    expect(themeManagerSpy.toggleTheme).toHaveBeenCalled();
  });

  it('should render search input when search is visible', () => {
    component.isSearchVisible = true;
    fixture.detectChanges();
    const searchInput = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(searchInput).toBeTruthy();
  });

  it('should not render search input when search is not visible', () => {
    component.isSearchVisible = false;
    fixture.detectChanges();
    const searchInput = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(searchInput).toBeFalsy();
  });
});

