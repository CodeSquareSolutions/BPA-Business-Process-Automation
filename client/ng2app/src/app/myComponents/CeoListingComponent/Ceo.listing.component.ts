 
import { Component ,OnInit } from '@angular/core';
import {   Ceo , FireLoopRef } from 'app/shared/sdk/models';

import {  } from 'app/shared/sdk/services';
import { RealTime } from 'app/shared/sdk/services';
import { Observable } from 'rxjs/Observable';
import { UserApi } from './../../shared/sdk/services/custom/User';

@Component({
  selector: 'app-CeoListing',
  templateUrl: './Ceo.listing.component.html',
  styleUrls: ['./Ceo.listing.component.css']
})
export class  CeoComponentListing  implements OnInit{
 private accessToken : any ;
 private ceo : Ceo = new Ceo();
 private ceos: Ceo[] = new Array <Ceo>();
 private ceoRef : FireLoopRef<Ceo>;

 
  public alerts: any = [];
  public successModal;
  public dangerModal;
  public deleteObj;
  
  constructor(
    private rt: RealTime ,private userApi: UserApi
    
    
    ) {
    
    this.rt.onReady().subscribe(() => {
    this.accessToken = this.userApi.getCurrentToken();
    this.ceoRef = this.rt.FireLoop.ref<Ceo>(Ceo);
    this.ceoRef.on('change',{order: 'id ASC' }).subscribe((ceos : Ceo[]) => this.ceos = ceos);
    
    });
  }
  ngOnInit() {
      
  }

public errorHandling(error){
    if(error.error = "401 Unauthorized Event"){
      this.alertDanager();
    }
    else 
    console.log(error.error);
  }

  
  public alertDanager(): void {
    this.alerts.push({
      type: 'danger',
      msg: `Opps...!! Sorry ! Your are Unauthorized role for this operation.`,
      timeout: 5000
    });
  }

  public delete(obj) : void {
    this.deleteObj = obj;
  }
  remove(ceo: Ceo): void {
    this.ceoRef.remove(ceo).subscribe(() => this.ceoRef.on('change',{order: 'id ASC'}).subscribe((ceo : Ceo[]) => this.ceos = ceo));
  }
  
 public addAlert(): void {
   this.remove(this.deleteObj);
    this.alerts.push({
      type: 'success',
      msg: `Successfully deleted`,
      timeout: 5000
    });
  }
 
  updateCeo() : void{
  this.ceoRef.upsert(this.ceo).subscribe(() => this.ceoRef.on('change',{order: 'id ASC' }).subscribe((ceos : Ceo[]) => this.ceos = ceos));
  for(var i in this.ceo) { this.ceo[i] = ""};
  }
  update(ceo): void {
    this.ceo = ceo;
  }
  } 