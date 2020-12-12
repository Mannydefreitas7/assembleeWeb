import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   constructor(private auth: AuthService, private router: Router) {
   }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(this.auth.authenticated)
      //  if (this.auth.authenticated) { 
          
      //  // this.auth.stateChanged();
      //   return true 
      // } 
      if ( this.auth.isLoggedIn() ) {
         
         return true;
     }

      this.router.navigate(['login'])
      return false;
   // return true;
  }
  
}
