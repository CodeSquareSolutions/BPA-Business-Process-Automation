/* tslint:disable */
import {
  Applicant
} from '../index';

declare var Object: any;
export interface LeaveInterface {
  "subject"?: string;
  "approvedbysupervisor"?: boolean;
  "approvedbyceo"?: boolean;
  "status"?: string;
  "id"?: number;
  "applicantId"?: number;
  applicant?: Applicant;
}

export class Leave implements LeaveInterface {
  "subject": string;
  "approvedbysupervisor": boolean;
  "approvedbyceo": boolean;
  "status": string;
  "id": number;
  "applicantId": number;
  applicant: Applicant;
  constructor(data?: LeaveInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Leave`.
   */
  public static getModelName() {
    return "Leave";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Leave for dynamic purposes.
  **/
  public static factory(data: LeaveInterface): Leave{
    return new Leave(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Leave',
      plural: 'Leaves',
      path: 'Leaves',
      properties: {
        "subject": {
          name: 'subject',
          type: 'string'
        },
        "approvedbysupervisor": {
          name: 'approvedbysupervisor',
          type: 'boolean'
        },
        "approvedbyceo": {
          name: 'approvedbyceo',
          type: 'boolean'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "applicantId": {
          name: 'applicantId',
          type: 'number'
        },
      },
      relations: {
        applicant: {
          name: 'applicant',
          type: 'Applicant',
          model: 'Applicant'
        },
      }
    }
  }
}
