import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {getPaginatedResult, getPaginationHeaders} from './pagination.helper';
import {IMessage} from '../_models/message';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {
  }

  public getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<IMessage[]>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<IMessage[]>(this.baseUrl + 'messages', params, this.http);
  }

  public getMessageThread(username: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.baseUrl + 'messages/thread/' + username);
  }

  public sendMessage(username: string, content: string): Observable<IMessage> {
    return this.http.post<IMessage>(this.baseUrl + 'messages', {recipientUsername: username, content});
  }

  public deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'messages/' + id);
  }
}
