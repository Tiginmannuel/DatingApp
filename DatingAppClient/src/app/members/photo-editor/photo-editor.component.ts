import {Component, Input, OnInit} from '@angular/core';
import {IMember} from '../../_models/member';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {environment} from 'src/environments/environment';
import {AccountService} from '../../_services/account.service';
import {take} from 'rxjs/operators';
import {IUser} from 'src/app/_models/user';
import {MembersService} from '../../_services/members.service';
import {IPhoto} from '../../_models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: IMember;
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public baseUrl = environment.apiUrl;
  public user: IUser;

  constructor(private readonly accountService: AccountService,
              private readonly membersService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file: FileItem) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response: string, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: IPhoto): void {
    this.membersService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(x => {
        if (x.isMain) {
          x.isMain = false;
        }
        if (x.id === photo.id) {
          x.isMain = true;
        }
      });
    });
  }

  deletePhoto(photoId: number): void {
    this.membersService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    });
  }

}
