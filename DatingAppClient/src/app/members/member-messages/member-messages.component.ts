import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {IMessage} from 'src/app/_models/message';
import {MessageService} from '../../_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() username: string;
  @Input() messages: IMessage[] = [];
  public messageContent: string;

  constructor(private readonly messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  public sendMessage(): void {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe((message: IMessage) => {
      this.messages.push(message);
      this.messageForm.reset();
    });
  }


}
