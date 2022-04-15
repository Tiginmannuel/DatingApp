import {Component, OnInit} from '@angular/core';
import {IMessage} from '../_models/message';
import {PaginatedResult, Pagination} from '../_models/pagination';
import {MessageService} from '../_services/message.service';
import {ConfirmService} from '../_services/confirm.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  public messages: IMessage[] = [];
  public pagination: Pagination;
  public container = 'Unread';
  public loading = false;
  private pageNumber = 1;
  private pageSize = 5;

  constructor(private readonly messageService: MessageService,
              private readonly confirmService: ConfirmService) {
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  public loadMessages(): void {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response: PaginatedResult<IMessage[]>) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      });
  }

  public pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  public deleteMessage(id: number): void {
    this.confirmService.confirm('Confirm delete message', 'This cannot be undone').subscribe((result: boolean) => {
      if (result) {
        this.messageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(this.messages.findIndex(x => x.id === id), 1);
        });
      }
    });
  }
}
