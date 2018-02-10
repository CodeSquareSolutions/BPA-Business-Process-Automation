import { UserApi } from './../custom/User';
import { Injectable }       from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoopBackAuth }      from './auth.service';
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  	
  constructor(private user: UserApi,private authService: LoopBackAuth, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
	console.log('Url:'+ url);
	if (this.user.isAuthenticated()) {
	//	console.log(this.user.isAuthenticated());
	//	console.log(this.user.getCurrent(),this.authService.getCurrentUserData());
		return true; 
	}
	else{
			this.router.navigate(['/login']);
			return false;
	}
    
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let loggedInUser= this.authService.getCurrentUserData();
	if (loggedInUser.role === 'ADMIN') {
	    return true;		
	} else {
		console.log('Unauthorized to open link: '+ state.url);
		return false;
	}
  }  
}