import { FullLayoutComponent } from './full-layout.component';
import { AuthGuardService } from './shared/sdk/services/core/auth-guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SDKBrowserModule } from './shared/sdk';
import { routing} from './app.routing'
import { AppComponent } from './app.component';
import { ModalModule,AlertModule } from 'ngx-bootstrap';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './sharedLayout/sidebar.directive';
import { AsideToggleDirective } from './sharedLayout/aside.directive';
import { BreadcrumbsComponent } from './sharedLayout/breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './sharedLayout/nav-dropdown.directive';
import { LoginComponent } from './myComponents/login/login';
import { RegisterComponent } from './myComponents/signup/signup';

 import { ApplicantComponent } from './myComponents/ApplicantComponent/Applicant.component';
 import { ApplicantComponentListing } from './myComponents/ApplicantListingComponent/Applicant.listing.component';
 
 import { CeoComponent } from './myComponents/CeoComponent/Ceo.component';
 import { CeoComponentListing } from './myComponents/CeoListingComponent/Ceo.listing.component';
 
@NgModule({
  declarations: [
    AppComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    LoginComponent,
    RegisterComponent,
    FullLayoutComponent,
    
    ApplicantComponent,
    ApplicantComponentListing,
    
    CeoComponent,
    CeoComponentListing,
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    SDKBrowserModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
