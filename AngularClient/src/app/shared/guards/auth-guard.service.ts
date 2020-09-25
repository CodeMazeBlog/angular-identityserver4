import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const roles = route.data['roles'] as Array<string>;
    if(!roles) {
      return this.checkIsUserAuthenticated();
    }
    else {
      return this.checkForAdministrator();
    }
  }

  private checkIsUserAuthenticated() {
    return this._authService.isAuthenticated()
      .then(res => {
        return res ? true : this.redirectToUnauthorized();
      });
  }

  private checkForAdministrator() {
    return this._authService.checkIfUserIsAdmin()
      .then(res => {
        return res ? true : this.redirectToUnauthorized();
      });
  }

  private redirectToUnauthorized() {
    this._router.navigate(['/unauthorized']);
    return false;
  }
}
