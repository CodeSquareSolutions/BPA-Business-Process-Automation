import { FireLoopRef } from './../../shared/sdk/models/FireLoopRef';
import { RoleMappingApi } from './../../shared/sdk/services/custom/RoleMapping';
import { Role } from './../../shared/sdk/models/Role';
import { RealTime } from './../../shared/sdk/services/core/real.time';
import { Response } from '@angular/http';
import { User } from './../../shared/sdk/models/User';
import { Component } from '@angular/core';
import { SDKToken } from './../../shared/sdk/models/BaseModels';
import { Router } from '@angular/router';
import { UserApi } from './../../shared/sdk/services/custom/User';
import { LoopBackAuth } from './../../shared/sdk/services/core/auth.service';
@Component({
  templateUrl: 'signup.html'
})
export class RegisterComponent {
     private role : Role = new Role();
    private roles : Role[] = new Array <Role>();
    private roleRef : FireLoopRef<Role>;
    private user : User = new User();
    constructor(private userApi: UserApi,private roleMappingApi : RoleMappingApi, private authService: LoopBackAuth,private router: Router,private rt: RealTime) { 
     this.rt.onReady().subscribe(() => {
    this.roleRef = this.rt.FireLoop.ref<Role>(Role);
    this.roleRef.on('change',{order: 'id ASC'}).subscribe((role: Role[]) => this.roles = role);
  });
  }

  signup(username, email, password, passwordConfirm, role) {
    if (username.value == null && email.value ==null){
      return alert('Username and Email can not be empty!');
    }
    if(password.value !== passwordConfirm.value  || password.value ==null || passwordConfirm.value == null) {
      return alert('Passwords required and must be match!');
    }
    var userObj={
      username: username.value,
      email: email.value,
      password: password.value,
      role: role.value,
      id : null
    }
    this.userApi.create(userObj).subscribe((res) => {
      console.log(res);
      this.roles.forEach(role => {
        if(role.name == userObj.role){
            var roleMappingObj= {
            "principalType": "USER",
            "principalId": res.id,
            "roleId": role.id
             }
          this.roleMappingApi.create(roleMappingObj).subscribe((res)=>{
            console.log(res);
          })
        }
      });
      if(res.id) {
         this.login(userObj.email, userObj.password);
      }
    });
  }

   login(email1, password1) {
    this.userApi.login({ email: email1, password: password1 })
    .subscribe((token: SDKToken) => {
      this.authService.setUser(token);
      this.router.navigate(['/components']);
    }, err => {
      alert(err && err.message ? err.message : 'Login failed!');
      password1.value = '';
    });
  }

}
