import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

interface Quote {
  text: string;
  author: string;
  role?: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class HeroComponent implements OnInit, OnDestroy {
  quotes: Quote[] = [
    {
      text: "Music expresses that which cannot be put into words and that which cannot remain silent.",
      author: "Victor Hugo",
      role: "Writer",
      backgroundImage: "assets/images/banner.png"
    },
    {
      text: "Where words fail, music speaks.",
      author: "Hans Christian Andersen",
      role: "Author",
      backgroundImage: "assets/images/banner2.jpg"
    },
    // Add more quotes as needed
  ];

  currentSlide = 0;
  private autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.quotes.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.quotes.length - 1 ? 0 : this.currentSlide + 1;
  }

  private startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000); // Change quote every 6 seconds
  }
}

