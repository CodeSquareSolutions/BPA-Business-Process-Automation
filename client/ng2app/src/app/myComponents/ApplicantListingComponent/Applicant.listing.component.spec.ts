import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantComponentListing } from './Applicant.listing.component';

describe('ApplicantComponent', () => {
  let component: ApplicantComponentListing;
  let fixture: ComponentFixture<ApplicantComponentListing>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantComponentListing ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantComponentListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});