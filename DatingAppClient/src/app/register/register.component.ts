import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public model: any = {};
  @Output() cancelRegister = new EventEmitter();

  constructor(private readonly accountService: AccountService,
              private readonly toaster: ToastrService) {
  }

  ngOnInit(): void {
  }

  public register(): void {
    this.accountService.register(this.model).subscribe((response) => {
      console.log(response);
      this.cancel();
    }, (error) => {
      this.toaster.error(error.error);
      console.log(error);
    });
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

}
