import { SnakebarComponent } from './../../../helper/tools/snakebar/snakebar.component';
import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {

  durationInSeconds: number = 2.5;

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.openSnackBar()
  }

  openSnackBar() {
  //   this._snackBar.open('研究資料來源：Cmoney股市同學會', '知道了！', {
  //     horizontalPosition: this.horizontalPosition,
  //     verticalPosition: this.verticalPosition,
  //     duration: this.durationInSeconds * 1000,
  //   });

    this._snackBar.openFromComponent(SnakebarComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: [
        'snakebar-panel'
      ]
    });
  }
}
