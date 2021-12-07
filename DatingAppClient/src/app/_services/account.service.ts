import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {ILoginModel, IUser} from '../_models/account-interface';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://localhost:23585/api/';
  private currentUserSource = new ReplaySubject<IUser>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private readonly http: HttpClient) {
  }

  public login(model: ILoginModel): Observable<IUser> {
    return this.http.post(this.baseUrl + 'account/login', model)
      .pipe(
        map((response: IUser) => {
          const user = response;
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
          return user;
        })
      );
  }

  public register(model: ILoginModel): Observable<IUser> {
    return this.http.post(this.baseUrl + 'account/register', model)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
          return user;
        })
      );
  }

  public setCurrentUser(user: IUser): void {
    this.currentUserSource.next(user);
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
