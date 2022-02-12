import {Component, OnInit} from '@angular/core';
import {IMember} from '../../_models/member';
import {MembersService} from '../../_services/members.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  public members$: Observable<IMember[]>;

  constructor(private readonly membersService: MembersService) {
  }

  ngOnInit(): void {
    this.members$ = this.membersService.getMembers();
  }
}
