import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private userService: UserService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        if ( this.userService.loggedIn() ) {
            request = request.clone({
                setHeaders: {
                    Authorization: this.userService.getToken()
                }
            });
        }

        return next.handle(request);
    }
}
