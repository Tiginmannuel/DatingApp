import {Component, OnInit} from '@angular/core';
import {IMember} from '../../_models/member';
import {MembersService} from '../../_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  public members: IMember[] = [];

  constructor(private readonly membersService: MembersService) {
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  public loadMembers(): void {
    this.membersService.getMembers().subscribe((data: IMember[]) => {
      this.members = data;
    });
  }
}
