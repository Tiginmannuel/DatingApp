import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountService} from '../_services/account.service';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/operators';
import {IUser} from '../_models/account-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly accountService: AccountService,
              private readonly toaster: ToastrService) {
  }

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user: IUser) => {
          if (user) {
            return true;
          } else {
            this.toaster.error('You Shall not pass!');
          }
        }
      )
    );
  }
}
