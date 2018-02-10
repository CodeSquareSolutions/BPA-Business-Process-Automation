/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { RoleMapping } from '../../models/RoleMapping';
import { Role } from '../../models/Role';
import { Leave } from '../../models/Leave';
import { Applicant } from '../../models/Applicant';
import { Supervisor } from '../../models/Supervisor';
import { Ceo } from '../../models/Ceo';
import { Test } from '../../models/Test';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    RoleMapping: RoleMapping,
    Role: Role,
    Leave: Leave,
    Applicant: Applicant,
    Supervisor: Supervisor,
    Ceo: Ceo,
    Test: Test,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
