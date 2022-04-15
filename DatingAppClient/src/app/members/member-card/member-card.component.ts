import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { IMember } from '../../_models/member';
import {PresenceService} from '../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: IMember;

  constructor(private readonly memberService: MembersService,
              private readonly toaster: ToastrService,
              public readonly presenceService: PresenceService) {
  }

  ngOnInit(): void {
  }

  public addLike(member: IMember): void {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toaster.success('You have liked ' + member.knownAs);
    });
  }

}
