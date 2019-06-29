import { Component, OnInit } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userid: string;
  email: string;
  password: string;

  constructor(
    private flashMessage: NgFlashMessageService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    if ( this.userid == '' || this.userid == undefined || this.email == '' || this.email == undefined || this.password == '' || this.password == undefined ) {
      this.flashMessage.showFlashMessage({messages: ['Empty field exists.'], type: 'danger', timeout: 3000});
      return false;
    }

    // validation email
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( !re.test(this.email) ) {
      this.flashMessage.showFlashMessage({messages: ['Not an email.'], type: 'danger', timeout: 3000});
      return false;
    }

    const user = {
      userid: this.userid,
      email: this.email,
      password: this.password
    };
    this.userService.registerUser(user).subscribe(data => {
      if ( data.success ) {
        this.flashMessage.showFlashMessage({
          messages: ['Registeration done - Log in please'],
          type: 'success',
          timeout: 2000
        });
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
