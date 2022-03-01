import {Component, OnInit} from '@angular/core';
import {IMember} from '../../_models/member';
import {MembersService} from '../../_services/members.service';
import {PaginatedResult, Pagination} from '../../_models/pagination';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {UserParams} from '../../_models/userParams';
import {IUser} from '../../_models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  public members: IMember[];
  public pagination: Pagination;
  public userParams: UserParams;
  private user: IUser;
  genderList = [{value: 'male', display: 'Male'}, {value: 'female', display: 'Female'}];

  constructor(private readonly membersService: MembersService) {
    this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  public pageChanged(event: PageChangedEvent): void {
    this.userParams.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams);
    this.loadMembers();
  }

  public resetFilter(): void {
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }

  public loadMembers(): void {
    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe((response: PaginatedResult<IMember[]>) => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }
}
