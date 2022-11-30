import { WordcloudComponent } from './display/features/wordcloud/wordcloud.component';
import { KolchartP2Component } from './display/features/kolchart-p2/kolchart-p2.component';
import { KolchartP1Component } from './display/features/kolchart-p1/kolchart-p1.component';
import { ChooseComponent } from './display/features/choose/choose.component';
import { ApologizeComponent } from './display/features/apologize/apologize.component';
import { HomeComponent } from './display/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'choose',
    pathMatch: 'full'
  },
  {
    path: 'choose',
    component: ChooseComponent
  },
  {
    path: 'home/:stock',
    component: HomeComponent,
  },
  {
    path: 'home/:stock/:author/kolchart1',
    component: KolchartP1Component
  },
  {
    path: 'kolchart1',
    component: KolchartP1Component
  },
  {
    path: 'home/:stock/:author/kolchart2',
    component: KolchartP2Component,
  },
  {
    path: 'kolchart2',
    component: KolchartP2Component,
  },
  {
    path: 'wordcloud/:stock',
    component: WordcloudComponent
  },
  {
    path: 'sorry',
    component: ApologizeComponent,
  },
  {
    path: '**',
    redirectTo: 'choose',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
