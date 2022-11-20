import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const materials = [
  MatSelectModule,
  MatButtonModule,
  MatSnackBarModule
]

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials
})
export class ShareMaterialsModule { }
