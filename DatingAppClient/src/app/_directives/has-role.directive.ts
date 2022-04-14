import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {take} from 'rxjs/operators';
import {IUser} from '../_models/user';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  user: IUser;

  constructor(private readonly viewContainerRef: ViewContainerRef,
              private readonly templateRef: TemplateRef<any>,
              private readonly accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user: IUser) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    if (!this.user?.roles || this.user === null) {
      this.viewContainerRef.clear();
    }

    if (this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
