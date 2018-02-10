import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoComponentListing } from './Ceo.listing.component';

describe('CeoComponent', () => {
  let component: CeoComponentListing;
  let fixture: ComponentFixture<CeoComponentListing>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CeoComponentListing ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CeoComponentListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});