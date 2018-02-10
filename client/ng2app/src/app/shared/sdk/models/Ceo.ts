/* tslint:disable */

declare var Object: any;
export interface CeoInterface {
  "name"?: string;
  "id"?: number;
}

export class Ceo implements CeoInterface {
  "name": string;
  "id": number;
  constructor(data?: CeoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Ceo`.
   */
  public static getModelName() {
    return "Ceo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Ceo for dynamic purposes.
  **/
  public static factory(data: CeoInterface): Ceo{
    return new Ceo(data);
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
      name: 'Ceo',
      plural: 'Ceos',
      path: 'Ceos',
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
