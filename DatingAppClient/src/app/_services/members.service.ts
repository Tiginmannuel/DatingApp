import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IMember} from '../_models/member';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  public members: IMember[] = [];

  constructor(private readonly http: HttpClient) {
  }

  public getMembers(): Observable<Array<IMember>> {
    if (this.members.length > 0) {
      return of(this.members);
    }
    return this.http.get<Array<IMember>>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  public getMember(username: string): Observable<IMember> {
    const member = this.members.find(x => x.username === username);
    if (member) {
      return of(member);
    }
    return this.http.get<IMember>(this.baseUrl + 'users/' + username);
  }

  public updateMember(member: IMember): Observable<any> {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
