import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeroComponent } from '../../UI/hero/hero.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HeroComponent,
    HomeComponent
  ],
  exports: [],
})
export class HomeModule { }
