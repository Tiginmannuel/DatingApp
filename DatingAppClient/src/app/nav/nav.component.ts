import {Component, OnInit} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {ILoginModel, IUser} from '../_models/account-interface';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public model: ILoginModel = {username: '', password: ''};

  constructor(public readonly accountService: AccountService,
              private readonly router: Router,
              private readonly toaster: ToastrService) {
  }

  ngOnInit(): void {
  }

  public login(): void {
    this.accountService.login(this.model).subscribe((response) => {
      this.router.navigateByUrl('/members');
    }, (error) => {
      console.log(error);
      this.toaster.error(error.error);
    });
  }

  public logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
