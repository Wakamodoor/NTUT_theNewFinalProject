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
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'sorry',
    component: ApologizeComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
