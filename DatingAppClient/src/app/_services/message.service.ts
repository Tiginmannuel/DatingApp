import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {getPaginatedResult, getPaginationHeaders} from './pagination.helper';
import {IMessage} from '../_models/message';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginatedResult} from '../_models/pagination';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {IUser} from '../_models/user';
import {take} from 'rxjs/operators';
import {IGroup} from '../_models/group';
import {BusyService} from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;

  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<IMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private readonly http: HttpClient,
              private readonly busyService: BusyService) {
  }

  public createHubConnection(user: IUser, otherUserName: string): void {
    this.busyService.busy();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUserName, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => console.log(err))
      .finally(() => this.busyService.idle());

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      });
    });

    this.hubConnection.on('UpdatedGroup', (group: IGroup) => {
      if (group.connections.some(x => x.username === otherUserName)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          this.messageThreadSource.next([...messages]);
        });
      }
    });
  }

  public stopHubConnection(): void {
    if (!this.hubConnection) {
      return;
    }
    this.messageThreadSource.next([]);
    this.hubConnection
      .stop()
      .catch(error => console.log(error));
  }

  public getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<IMessage[]>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<IMessage[]>(this.baseUrl + 'messages', params, this.http);
  }

  public getMessageThread(username: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.baseUrl + 'messages/thread/' + username);
  }

  public async sendMessage(username: string, content: string): Promise<any> {
    return this.hubConnection.invoke('SendMessage', {recipientUsername: username, content})
      .catch(err => console.log(err));
  }

  public deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'messages/' + id);
  }
}
