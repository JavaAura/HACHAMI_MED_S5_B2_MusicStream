import { Component } from '@angular/core';
import { NewTrackModalComponent } from '../../UI/new-track-modal/new-track-modal.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchService } from '../../service/search/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NewTrackModalComponent, RouterLink, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isSearchVisible = false;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(private searchService: SearchService) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.performSearch(term);
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private performSearch(term: string) {
    this.searchService.updateSearchTerm(term);
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  openNewTrackModal() {
    const modal = document.getElementById('new_track_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  toggleTheme() {
    // Assuming ThemeManager is a global object
    (window as any).ThemeManager.toggleTheme();
  }
}

