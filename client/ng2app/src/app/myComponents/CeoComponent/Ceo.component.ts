
import { Component, OnInit } from '@angular/core';
import {  Ceo , FireLoopRef } from 'app/shared/sdk/models';
import {  } from 'app/shared/sdk/services';
import { RealTime } from 'app/shared/sdk/services';
import { Observable } from 'rxjs/Observable';
import { UserApi } from './../../shared/sdk/services/custom/User';

@Component({
  selector: 'app-Ceo',
  templateUrl: './Ceo.component.html',
  styleUrls: ['./Ceo.component.css']
})

export class CeoComponent implements OnInit {
    private accessToken : any ;
    public alerts: any = [];
    private ceo : Ceo = new Ceo();
    private ceos : Ceo[] = new Array <Ceo>();
    private ceoRef : FireLoopRef<Ceo>;
  
    constructor(private rt: RealTime ,private userApi: UserApi
    ) {
    
    this.rt.onReady().subscribe(() => {
    this.accessToken = this.userApi.getCurrentToken();
    this.ceoRef = this.rt.FireLoop.ref<Ceo>(Ceo);
    this.ceoRef.on('change',{order: 'id ASC'}).subscribe((ceo: Ceo[]) => this.ceos = ceo);

    
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

   
  addCeo() : void{
    this.ceoRef.create(this.ceo).subscribe(() => this.ceo = new Ceo (),(error)=> this.errorHandling(error));
    for(var i in this.ceo) 
      { this.ceo[i] = ""};
  }
  
} 