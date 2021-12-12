import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public registerMode = false;

  constructor() {
  }

  public registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  public cancelRegisterMode($event: boolean): void {
    this.registerMode = $event;
  }

}
