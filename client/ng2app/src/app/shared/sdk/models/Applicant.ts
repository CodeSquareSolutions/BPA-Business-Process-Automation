/* tslint:disable */
import {
  Leave
} from '../index';

declare var Object: any;
export interface ApplicantInterface {
  "applicantname"?: string;
  "id"?: number;
  leave?: Leave[];
}

export class Applicant implements ApplicantInterface {
  "applicantname": string;
  "id": number;
  leave: Leave[];
  constructor(data?: ApplicantInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Applicant`.
   */
  public static getModelName() {
    return "Applicant";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Applicant for dynamic purposes.
  **/
  public static factory(data: ApplicantInterface): Applicant{
    return new Applicant(data);
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
      name: 'Applicant',
      plural: 'Applicants',
      path: 'Applicants',
      properties: {
        "applicantname": {
          name: 'applicantname',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        leave: {
          name: 'leave',
          type: 'Leave[]',
          model: 'Leave'
        },
      }
    }
  }
}
