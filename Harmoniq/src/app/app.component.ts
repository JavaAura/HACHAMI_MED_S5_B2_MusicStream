import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Harmoniq';



  constructor( public router: Router) {}

  // ngOnInit() {
  //   this.primengConfig.ripple = true;
  //   // Add default toast configuration
  //   this.primengConfig.setTranslation({
  //     accept: 'Accept',
  //     reject: 'Cancel',
  //     //Add more translations if needed
  //   });
  // }
}
