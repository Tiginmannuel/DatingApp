import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private route: Router,
    private toaster: ToastrService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err) {
          switch (err.status) {
            case 400:
              if (err.error.errors) {
                const modalStateErrors = [];
                for (const key in err.error.errors) {
                  if (err.error.errors[key]) {
                    modalStateErrors.push(err.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else if (typeof (err.error) === 'object') {
                this.toaster.error(err.statusText, err.status);
              } else {
                this.toaster.error(err.error, err.status);
              }
              break;
            case 401:
              this.toaster.error(err.statusText, err.status);
              break;
            case 404:
              this.route.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { error: err.error } };
              this.route.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toaster.error('Something unexpected went wrong');
              console.log(err);
              break;
          }
        }
        return throwError(err);
      })
    );
  }
}
