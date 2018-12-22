import { uniqueId } from 'lodash'

export default class InstanceConstructor {
  public readonly $id: string = uniqueId('App_')

  public styles: any = {}
  public template: string = ``
  public data: any = {}

  public $refs: any = {}
}
