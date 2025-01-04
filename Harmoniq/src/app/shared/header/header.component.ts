import { Component } from '@angular/core';
import { NewTrackModalComponent } from '../../UI/new-track-modal/new-track-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NewTrackModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
