import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {ILoginModel, IUser} from '../_models/user';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private readonly http: HttpClient) {
  }

  public login(model: ILoginModel): Observable<IUser> {
    return this.http.post(this.baseUrl + 'account/login', model)
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setCurrentUser(user);
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
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  public setCurrentUser(user: IUser): void {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  public getDecodedToken(token): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
