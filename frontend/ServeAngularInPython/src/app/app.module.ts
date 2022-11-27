import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './display/home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareMaterialsModule } from './helper/material/share-materials.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxHideOnScrollModule } from 'ngx-hide-on-scroll';
import { ApologizeComponent } from './display/features/apologize/apologize.component';
import { ChooseComponent } from './display/features/choose/choose.component';
import { SnakebarComponent } from './helper/tools/snakebar/snakebar.component';
import { KolchartP1Component } from './display/features/kolchart-p1/kolchart-p1.component';
import { KolchartP2Component } from './display/features/kolchart-p2/kolchart-p2.component';
import { NgxSimpleParallaxJsModule } from 'ngx-simple-parallax-js';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ApologizeComponent,
    ChooseComponent,
    SnakebarComponent,
    KolchartP1Component,
    KolchartP2Component,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ShareMaterialsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxHideOnScrollModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    BrowserAnimationsModule,
    NgxSimpleParallaxJsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
