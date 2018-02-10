 
import { Component ,OnInit } from '@angular/core';
import {   Applicant , Leave , FireLoopRef } from 'app/shared/sdk/models';
import { ActivatedRoute } from '@angular/router';
import {  ApplicantApi , } from 'app/shared/sdk/services';
import { RealTime } from 'app/shared/sdk/services';
import { Observable } from 'rxjs/Observable';
import { UserApi } from './../../shared/sdk/services/custom/User';

@Component({
  selector: 'app-ApplicantListing',
  templateUrl: './Applicant.listing.component.html',
  styleUrls: ['./Applicant.listing.component.css']
})
export class  ApplicantComponentListing  implements OnInit{
 private accessToken : any ;
 private applicant : Applicant = new Applicant();
 private applicants: Applicant[] = new Array <Applicant>();
 private applicantRef : FireLoopRef<Applicant>;

 
  private leaveArray = new Array< any >();
  private leave : Leave= new Leave();

  public alerts: any = [];
  public successModal;
  public dangerModal;
  private rel_Id: number;
  private modelName;
  private sub: any;
  public deleteObj;
  
  constructor(
    private rt: RealTime ,private userApi: UserApi
    
    ,private route: ActivatedRoute 
    , private applicantApi: ApplicantApi 
    ) {
    this.leaveArray = [];
    this.rt.onReady().subscribe(() => {
    this.accessToken = this.userApi.getCurrentToken();
    this.applicantRef = this.rt.FireLoop.ref<Applicant>(Applicant);
    this.applicantRef.on('change',{order: 'id ASC' , where : {id : this.rel_Id ,}}).subscribe((applicants : Applicant[]) => this.applicants = applicants);
    
    });
  }
  ngOnInit() {
      
      this.sub = this.route.params.subscribe(params => {
        if (params['applicantId'] == undefined ){ this.rel_Id = undefined;}// (+) converts string 'id' to a number
        else if (params['applicantId'] != undefined ){this.rel_Id = +params['applicantId'];}
      });
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
  remove(applicant: Applicant): void {
    this.applicantRef.remove(applicant).subscribe(() => this.applicantRef.on('change',{order: 'id ASC'}).subscribe((applicant : Applicant[]) => this.applicants = applicant));
  }
  
 public addAlert(): void {
   this.remove(this.deleteObj);
    this.alerts.push({
      type: 'success',
      msg: `Successfully deleted`,
      timeout: 5000
    });
  }

  updateApplicants(): void {
    this.applicantApi.deleteLeave(this.applicant.id).subscribe((error)=> this.errorHandling(error));    
    this.applicantRef.upsert(this.applicant).subscribe(( applicant :  Applicant) => this.createRelations(applicant),(error)=> this.errorHandling(error));
    for(var i in this.applicant) { this.applicant[i] = ""};
  }
  
  addLeave() {
    var temp = {'subject':this.leave.subject,'approvedbysupervisor':this.leave.approvedbysupervisor,'approvedbyceo':this.leave.approvedbyceo,'status':this.leave.status,};
    this.leaveArray.push(temp);
    for(var i in this.leave) { this.leave[i] = ""};
  }

  removeLeave(leave) {
    let index = this.leaveArray.indexOf(leave);
    this.leaveArray.splice(index, 1);
  }
  
  createRelations( applicant) : void { 
    this.applicantRef.on('change',{order: 'id ASC' , where : {id : this.rel_Id ,}}).subscribe((applicants : Applicant[]) => this.applicants = applicants);
    this.applicantApi.createManyLeave(applicant.id, this.leaveArray).subscribe(() => this.leaveArray = [],(error)=> this.errorHandling(error));
  }

  update(applicant) : void{
    this.applicant = applicant;
    this.applicantApi.getLeave( this.applicant.id).subscribe((leave : Leave) => this.initiateRelLeave(leave),(error)=> this.errorHandling(error));
  }
  initiateRelLeave(leave): void {
    var temp;
    this.leaveArray = [];    
    for(var j in leave) { 
      temp = {'subject':leave[j].subject,'approvedbysupervisor':leave[j].approvedbysupervisor,'approvedbyceo':leave[j].approvedbyceo,'status':leave[j].status,};
      this.leaveArray.push(temp);
    };
  }} 