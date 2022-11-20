import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snakebar',
  templateUrl: './snakebar.component.html',
  styleUrls: ['./snakebar.component.css']
})
export class SnakebarComponent implements OnInit {


  constructor(
    public snackBarRef: MatSnackBarRef<string>,
  ) { }

  ngOnInit(): void {
  }

}
