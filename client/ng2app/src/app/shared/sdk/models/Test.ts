/* tslint:disable */

declare var Object: any;
export interface TestInterface {
  "testname"?: string;
  "id"?: number;
}

export class Test implements TestInterface {
  "testname": string;
  "id": number;
  constructor(data?: TestInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Test`.
   */
  public static getModelName() {
    return "Test";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Test for dynamic purposes.
  **/
  public static factory(data: TestInterface): Test{
    return new Test(data);
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
      name: 'Test',
      plural: 'Tests',
      path: 'Tests',
      properties: {
        "testname": {
          name: 'testname',
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
