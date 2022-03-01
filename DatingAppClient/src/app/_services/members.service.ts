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

  private static getPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();

    if (pageNumber !== null && pageSize !== null) {
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return params;
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
    let params = MembersService.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender.toString());
    params = params.append('orderBy', userParams.orderBy.toString());

    return this.getPaginatedResult<IMember[]>(this.baseUrl + 'users', params)
      .pipe(map((res: PaginatedResult<IMember[]>) => {
        this.memberCache.set(Object.values(userParams).join('-'), res);
        return res;
      }));
  }

  private getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, {observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
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
}
