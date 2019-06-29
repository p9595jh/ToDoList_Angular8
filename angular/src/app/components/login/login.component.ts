import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userid: string;
  password: string;

  constructor(
    private userService: UserService,
    private flashMessage: NgFlashMessageService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    if ( this.userid == '' || this.password == '' || this.userid == undefined || this.password == undefined ) {
      this.flashMessage.showFlashMessage({
        messages: ['Empty field exists.'],
        type: 'danger',
        timeout: 3000
      });
      return false;
    } else {

      const user = {
        userid: this.userid,
        password: this.password
      };
      this.userService.authenticateUser(user).subscribe((data: any) => {
        if ( data.success ) {
          this.userService.storeUserData(data.token);
          this.router.navigate(['/']);
        } else {
          this.flashMessage.showFlashMessage({
            messages: [data.msg],
            type: 'danger',
            timeout: 3000
          });
        }
      });

    }

  }

}
