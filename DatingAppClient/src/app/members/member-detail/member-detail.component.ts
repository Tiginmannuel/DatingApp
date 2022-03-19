import {Component, OnInit, ViewChild} from '@angular/core';
import {IMember} from '../../_models/member';
import {MembersService} from '../../_services/members.service';
import {ActivatedRoute} from '@angular/router';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {IMessage} from '../../_models/message';
import {MessageService} from '../../_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  public member: IMember;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  public activeTab: TabDirective;
  public messages: IMessage[] = [];

  constructor(private readonly membersService: MembersService,
              private readonly messageService: MessageService,
              private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.member = data.member;
    });

    this.route.queryParams.subscribe((params) => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];

    this.galleryImages = this.getImages();
  }

  private getImages(): { small: string, medium: string, big: string }[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      });
    }
    return imageUrls;
  }

  public loadMessages(): void {
    this.messageService.getMessageThread(this.member.username).subscribe((response: IMessage[]) => {
      this.messages = response;
    });
  }

  public onTabActivated(data: TabDirective): void {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    }
  }

  public selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }

}
