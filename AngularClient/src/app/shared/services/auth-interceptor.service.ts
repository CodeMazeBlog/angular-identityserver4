import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.startsWith(Constants.apiRoot)){
     return this.interceptRequestWithAccessToken(req, next);
    }
    else {
      return next.handle(req);
    }
  }

  interceptRequestWithAccessToken(request: HttpRequest<any>, next: HttpHandler) {
    return from(
      this._authService.getAccessToken()
        .then(accessToken => {

          if (!accessToken) {
            this._authService.signinSilent().then(user => {
              return this.updateRequestHeader(request, next, user.access_token);
            });
          } else {
            return this.updateRequestHeader(request, next, accessToken);
          }
        })
    );
  }

  updateRequestHeader(request: HttpRequest<any>, next: HttpHandler, accessToken: string) {
    const headerss = request.headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );

    const authReq = request.clone({ headers: headerss });
    return lastValueFrom(next.handle(authReq));
  }
}
