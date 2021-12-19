import {Component, OnInit} from '@angular/core';
import {IMember} from '../../_models/member';
import {MembersService} from '../../_services/members.service';
import {ActivatedRoute} from '@angular/router';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  public member: IMember;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];

  constructor(private readonly membersService: MembersService,
              private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];
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

  private loadMember(): void {
    this.membersService.getMember(this.route.snapshot.paramMap.get('username')).subscribe((member: IMember) => {
      this.member = member;
      this.galleryImages = this.getImages();
    });
  }

}
