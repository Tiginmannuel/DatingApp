import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent {
  public baseUrl = 'http://localhost:23585/api/';
  public validationErrors: string[] = [];

  constructor(private http: HttpClient) {
  }

  get404Error(): void {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log(err);
    });
  }

  get400Error(): void {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log(err);
    });
  }

  get500Error(): void {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log(err);
    });
  }

  get401Error(): void {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe(response => {
      console.log(response);
    }, err => {
      console.log(err);
    });
  }

  get400ValidationError(): void {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log(err);
      this.validationErrors = err;
    });
  }
}
