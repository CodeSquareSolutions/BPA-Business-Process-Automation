
import { FullLayoutComponent } from './full-layout.component';
import { AuthGuardService } from './shared/sdk/services/core/auth-guard';
import {ModuleWithProviders} from '@angular/core';
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './myComponents/login/login';
import { RegisterComponent } from './myComponents/signup/signup';


  import { ApplicantComponent } from './myComponents/ApplicantComponent/Applicant.component';
  import { ApplicantComponentListing } from './myComponents/ApplicantListingComponent/Applicant.listing.component';
 
  import { CeoComponent } from './myComponents/CeoComponent/Ceo.component';
  import { CeoComponentListing } from './myComponents/CeoListingComponent/Ceo.listing.component';
 

const appRoutes: Routes = [
     {path : '' , component:LoginComponent},
     {path : 'signup' , component:RegisterComponent },
     { path: 'components', component: FullLayoutComponent, canActivate: [ AuthGuardService ] ,
     children: [
     {path : 'applicant' , component:ApplicantComponent ,outlet: 'home', canActivate: [ AuthGuardService ]},
     {path : 'applicantListing' , component:ApplicantComponentListing ,outlet: 'home', canActivate: [ AuthGuardService ]},
     {path : 'ceo' , component:CeoComponent ,outlet: 'home', canActivate: [ AuthGuardService ]},
     {path : 'ceoListing' , component:CeoComponentListing ,outlet: 'home', canActivate: [ AuthGuardService ]},
     // otherwise redirect to home
    { path: '**', redirectTo: '' }
    ]
    }
];
//export class routing {}
export const routing = RouterModule.forRoot(appRoutes);