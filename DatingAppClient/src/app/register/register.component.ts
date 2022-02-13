import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {ToastrService} from 'ngx-toastr';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {IUser} from '../_models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public model: any = {};
  public registerForm: FormGroup;
  public maxDate: Date;
  public validationErrors: string[] = [];
  @Output() cancelRegister = new EventEmitter();

  constructor(private readonly accountService: AccountService,
              private readonly toaster: ToastrService,
              private readonly fb: FormBuilder,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  public initializeForm(): void {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  public matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true};
    };
  }

  public register(): void {
    this.accountService.register(this.registerForm.value).subscribe((response: IUser) => {
      this.router.navigateByUrl('/members');
      this.cancel();
    }, (error) => {
      this.validationErrors = error;
    });
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

}
