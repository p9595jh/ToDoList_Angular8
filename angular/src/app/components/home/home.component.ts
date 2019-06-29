import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService
  ) {
    if ( this.userService.loggedIn() ) {
      this.userService.getProfile().subscribe(profile => {
        this.user = profile;
      });
    }
  }

  ngOnInit() {
  }

}
