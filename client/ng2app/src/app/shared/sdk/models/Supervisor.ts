/* tslint:disable */

declare var Object: any;
export interface SupervisorInterface {
  "name"?: string;
  "id"?: number;
}

export class Supervisor implements SupervisorInterface {
  "name": string;
  "id": number;
  constructor(data?: SupervisorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Supervisor`.
   */
  public static getModelName() {
    return "Supervisor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Supervisor for dynamic purposes.
  **/
  public static factory(data: SupervisorInterface): Supervisor{
    return new Supervisor(data);
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
      name: 'Supervisor',
      plural: 'Supervisors',
      path: 'Supervisors',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
