import {Component, OnInit} from '@angular/core';
import {AccountService} from './_services/account.service';
import {PresenceService} from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'The Dating App';

  constructor(private readonly accountService: AccountService,
              private readonly presenceService: PresenceService) {
  }

  ngOnInit(): void {
    this.setCurrentUset();
  }

  public setCurrentUset(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accountService.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }
  }
}
