import { RealTime } from './../../shared/sdk/services/core/real.time';
import { User, FireLoopRef  } from './../../shared/sdk/models';
import { SDKToken } from './../../shared/sdk/models/BaseModels';
import { Router } from '@angular/router';
import { UserApi } from './../../shared/sdk/services/custom/User';
import { LoopBackAuth } from './../../shared/sdk/services/core/auth.service';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'login.html'
})
export class LoginComponent {
  private user = new User();
 private userRef : FireLoopRef<User>;
  constructor(private rt:RealTime, private userApi: UserApi, private authService: LoopBackAuth,private router: Router) { 
     this.rt.onReady().subscribe(() => {
    this.userRef = this.rt.FireLoop.ref<User>(User);
    });

  }
  login(email, password) {
    this.userApi.login({ email: email.value, password: password.value })
    .subscribe((token: SDKToken) => {
      this.authService.setUser(token);
      this.router.navigate(['/components']);
    }, err => {
      alert(err && err.message ? err.message : 'Login failed!');
      password.value = '';
    });
  }
  signupPage(){
    this.router.navigate(['/signup']);
  }

}