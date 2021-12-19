import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IMember} from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {
  }

  public getMembers(): Observable<Array<IMember>> {
    return this.http.get<Array<IMember>>(this.baseUrl + 'users');
  }

  public getMember(username: string): Observable<IMember> {
    return this.http.get<IMember>(this.baseUrl + 'users/' + username);
  }
}
