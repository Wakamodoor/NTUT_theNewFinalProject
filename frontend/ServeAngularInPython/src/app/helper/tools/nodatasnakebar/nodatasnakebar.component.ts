import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nodatasnakebar',
  templateUrl: './nodatasnakebar.component.html',
  styleUrls: ['./nodatasnakebar.component.css']
})
export class NodatasnakebarComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<string>,
  ) { }

  ngOnInit(): void {
  }

}
