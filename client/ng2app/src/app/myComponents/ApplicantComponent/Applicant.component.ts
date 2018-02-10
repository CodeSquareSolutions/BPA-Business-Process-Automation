
import { Component, OnInit } from '@angular/core';
import {  Applicant , Leave , FireLoopRef } from 'app/shared/sdk/models';
import {  ApplicantApi , } from 'app/shared/sdk/services';
import { RealTime } from 'app/shared/sdk/services';
import { Observable } from 'rxjs/Observable';
import { UserApi } from './../../shared/sdk/services/custom/User';

@Component({
  selector: 'app-Applicant',
  templateUrl: './Applicant.component.html',
  styleUrls: ['./Applicant.component.css']
})

export class ApplicantComponent implements OnInit {
    private accessToken : any ;
    public alerts: any = [];
    private applicant : Applicant = new Applicant();
    private applicants : Applicant[] = new Array <Applicant>();
    private applicantRef : FireLoopRef<Applicant>;
  
    private leaveArray = new Array< any >();
    private leave : Leave= new Leave();
  
    constructor(private rt: RealTime ,private userApi: UserApi
    , private applicantApi: ApplicantApi ) {
    this.leaveArray = [];
    this.rt.onReady().subscribe(() => {
    this.accessToken = this.userApi.getCurrentToken();
    this.applicantRef = this.rt.FireLoop.ref<Applicant>(Applicant);
    this.applicantRef.on('change',{order: 'id ASC'}).subscribe((applicant: Applicant[]) => this.applicants = applicant);

    
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

  
  createApplicants(): void {
    this.applicantApi.create(this.applicant).subscribe(( applicant :  Applicant) => this.createRelations(applicant),(error)=> this.errorHandling(error));
    for(var i in this.applicant) 
      { this.applicant[i] = ""};
  }
  
  addLeaveHasManyInThrough() {
    var temp = {'subject':this.leave.subject,'approvedbysupervisor':this.leave.approvedbysupervisor,'approvedbyceo':this.leave.approvedbyceo,'status':this.leave.status,};
    this.leaveArray.push(temp);
    for(var i in this.leave) 
      { this.leave[i] = ""};
  }
  removeLeave(leave) {
    let index = this.leaveArray.indexOf(leave);
    this.leaveArray.splice(index, 1);
  }
  
  createRelations( applicant) : void { 
    this.applicantApi.createManyLeave(applicant.id, this.leaveArray).subscribe(() => this.leaveArray = [],(error)=> this.errorHandling(error));
  }
  
} 