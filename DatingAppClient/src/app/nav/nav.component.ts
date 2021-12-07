import {Component, OnInit} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {ILoginModel, IUser} from '../_models/account-interface';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public model: ILoginModel = {username: '', password: ''};

  constructor(public readonly accountService: AccountService) {
  }

  ngOnInit(): void {
  }

  public login(): void {
    this.accountService.login(this.model).subscribe((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  public logout(): void {
    this.accountService.logout();
  }
}
