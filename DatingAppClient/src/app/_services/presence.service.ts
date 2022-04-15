import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {ToastrService} from 'ngx-toastr';
import {IUser} from '../_models/user';
import {BehaviorSubject} from 'rxjs';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  public onlineUser$ = this.onlineUsersSource.asObservable();

  constructor(private readonly toaster: ToastrService,
              private readonly router: Router) {
  }

  createHubConnection(user: IUser): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUser$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username]);
      });
    });

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUser$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(x => x !== username)]);
      });
    });

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toaster.info(knownAs + ' has sent you a new message!')
        .onTap
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl('/members/' + username + '?tab=3').then();
        });
    });
  }

  stopHubConnection(): void {
    this.hubConnection
      .stop()
      .catch(error => console.log(error));
  }
}
