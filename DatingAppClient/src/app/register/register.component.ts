import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUser} from '../_models/account-interface';
import {AccountService} from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public model: any = {};
  @Output() cancelRegister = new EventEmitter();

  constructor(private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
  }

  public register(): void {
    this.accountService.register(this.model).subscribe((response) => {
      console.log(response);
      this.cancel();
    }, (error) => {
      console.log(error);
    });
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

}
