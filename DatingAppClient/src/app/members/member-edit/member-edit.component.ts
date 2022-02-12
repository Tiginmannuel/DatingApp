import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '../../_services/account.service';
import {IMember} from '../../_models/member';
import {IUser} from '../../_models/user';
import {MembersService} from '../../_services/members.service';
import {take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  public member: IMember;
  public user: IUser;

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private readonly accountService: AccountService,
              private readonly membersService: MembersService,
              private readonly toastrService: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  private loadMember(): void {
    this.membersService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
    });
  }

  public updateMember(): void {
    this.membersService.updateMember(this.member).subscribe(() => {
      this.toastrService.success('Profile Updated Successfully');
      this.editForm.reset(this.member);
    });
  }

}
