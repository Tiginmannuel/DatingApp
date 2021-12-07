import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../_models/account-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public registerMode = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  public registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  public cancelRegisterMode($event: boolean): void {
    this.registerMode = $event;
  }

}
