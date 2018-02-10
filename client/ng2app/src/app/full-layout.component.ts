import { Component, OnInit } from '@angular/core';
import { LoopBackAuth } from './shared/sdk/services/core/auth.service';
import { Router } from '@angular/router';
import { UserApi } from './shared/sdk/services/custom/User';
@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

 private accessToken : any ;
  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void {}

  public user : any;
  constructor(private userApi: UserApi,private router: Router,private auth: LoopBackAuth) {
   
   this.user = this.auth.getCurrentUserData();
   this.accessToken = this.userApi.getCurrentToken();

   }


 logOut(){
   this.userApi.logout().subscribe(() => {
      console.log(this.userApi);
      this.router.navigate(['/login']);
    });
 }
}
