import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'The Dating App';
  public users: any;

  constructor(private readonly http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
    this.http.get('http://localhost:5000/api/users').subscribe(data => {
      this.users = data;
    }, (error) => {
      console.log(error);
    });
  }
}
