import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ServeAngularInPython';

  ifChoose: boolean

  sendChooseEvent($event) {
    console.log($event)
  }
}
