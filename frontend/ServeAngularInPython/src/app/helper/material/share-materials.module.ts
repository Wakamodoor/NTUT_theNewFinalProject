import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

const materials = [
  MatSelectModule,
  MatButtonModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatFormFieldModule,
  MatInputModule,
]

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials
})
export class ShareMaterialsModule { }
