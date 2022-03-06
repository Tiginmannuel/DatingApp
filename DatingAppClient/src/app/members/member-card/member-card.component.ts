import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { IMember } from '../../_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: IMember;

  constructor(private memberService: MembersService, private toaster: ToastrService) {
  }

  ngOnInit(): void {
  }

  public addLike(member: IMember): void {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toaster.success('You have liked ' + member.knownAs);
    });
  }

}
