import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Observable} from 'rxjs';
import {ConfirmDialogComponent} from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef;

  constructor(private readonly modalService: BsModalService) {
  }

  confirm(title: string = 'Confirmation',
          message: string = 'Are you sure you want to do this?',
          btnOkText: string = 'Ok',
          btnCancelText: string = 'Cancel'): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    };
    this.bsModelRef = this.modalService.show(ConfirmDialogComponent, config);

    return new Observable<boolean>(this.getResult());
  }

  private getResult(): any {
    return (observer) => {
      const subscription = this.bsModelRef.onHidden.subscribe(() => {
        observer.next(this.bsModelRef.content.result);
        observer.complete();
      });

      return {
        unsubscribe(): any {
          subscription.unsubscribe();
        }
      };
    };
  }
}
