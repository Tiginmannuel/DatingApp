import {MembersService} from './../_services/members.service';
import {IMember} from './../_models/member';
import {Component, OnInit} from '@angular/core';
import {PaginatedResult, Pagination} from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  public members: Partial<IMember[]> = [];
  public predicate = 'liked';
  private pageNumber = 1;
  private pageSize = 5;
  public pagination: Pagination;

  constructor(private memberService: MembersService) {
  }

  ngOnInit(): void {
    this.loadLikes();
  }

  public loadLikes(): void {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response: PaginatedResult<Partial<IMember[]>>) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  public pageChanged(event: any): void {
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
