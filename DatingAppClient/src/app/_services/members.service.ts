import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IMember} from '../_models/member';
import {map, take} from 'rxjs/operators';
import {PaginatedResult} from '../_models/pagination';
import {UserParams} from '../_models/userParams';
import {AccountService} from './account.service';
import {IUser} from '../_models/user';
import {getPaginatedResult, getPaginationHeaders} from './pagination.helper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  public userParams: UserParams;
  public user: IUser;
  private baseUrl = environment.apiUrl;
  public members: IMember[] = [];
  private memberCache = new Map();

  constructor(private readonly http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  public getUserParams(): UserParams {
    return this.userParams;
  }

  public setUserParams(userParams: UserParams): void {
    this.userParams = userParams;
  }

  public resetUserParams(): UserParams {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  public getMembers(userParams: UserParams): Observable<PaginatedResult<IMember[]>> {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender.toString());
    params = params.append('orderBy', userParams.orderBy.toString());

    return getPaginatedResult<IMember[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map((res: PaginatedResult<IMember[]>) => {
        this.memberCache.set(Object.values(userParams).join('-'), res);
        return res;
      }));
  }

  public getMember(username: string): Observable<IMember> {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((user: IMember) => user.username === username);
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

  public setMainPhoto(photoId: number): Observable<any> {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  public deletePhoto(photoId: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  public addLike(username: string): Observable<any> {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  public getLikes(predicate: string, pageNumber: number, pageSize: number): Observable<PaginatedResult<Partial<IMember[]>>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<IMember[]>>(this.baseUrl + 'likes', params, this.http);
  }
}
