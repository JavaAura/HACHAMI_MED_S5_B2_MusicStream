import { Component, OnInit, ElementRef } from '@angular/core';
import { HeroComponent } from '../../UI/hero/hero.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent], // Import the standalone HeroComponent here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private sky: HTMLElement | null = null;
  private center: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private elementRef: ElementRef) {}

  private dot(i: number): HTMLElement {
    const size: number = Math.round(Math.random() + 1);
    const root: HTMLElement = document.createElement('span');
    root.style.position = 'absolute';
    root.style.top = this.center.y + 'px';
    root.style.left = this.center.x + 'px';
    root.classList.add('star', `size-${size}`, `axis-${i}`);
    return root;
  }

  private clear(): void {
    if (this.sky) {
      this.sky.innerHTML = '';
    }
  }

  private init(): void {
    this.sky = this.elementRef.nativeElement.querySelector('#sky');
    if (this.sky) {
      this.center = {
        x: this.sky.clientWidth / 2,
        y: this.sky.clientHeight / 2,
      };
      this.clear();
      for (let i = 0; i < 360; i++) {
        this.sky.appendChild(this.dot(i));
      }
    }
  }

  ngOnInit(): void {
    this.init();
}

}
