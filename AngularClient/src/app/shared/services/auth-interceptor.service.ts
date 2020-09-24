import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.startsWith(Constants.apiRoot)){
      return from(
        this._authService.getAccessToken()
        .then(token => {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const authRequest = req.clone({ headers });
          return next.handle(authRequest).toPromise();
        })
      );
    }
    else {
      return next.handle(req);
    }
  }
}
