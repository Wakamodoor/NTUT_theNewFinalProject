import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [],
  imports: [
    MatSelectModule,
    MatButtonModule
  ],
  exports: [
    MatSelectModule,
    MatButtonModule
  ]
})
export class ShareMaterialsModule { }
