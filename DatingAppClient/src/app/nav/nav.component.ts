import {Component} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {ILoginModel} from '../_models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  public model: ILoginModel = {username: '', password: ''};

  constructor(public readonly accountService: AccountService,
              private readonly router: Router) {
  }

  public login(): void {
    this.accountService.login(this.model).subscribe((response) => {
      this.router.navigateByUrl('/members');
    });
  }

  public logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
