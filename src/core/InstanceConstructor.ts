import { uniqueId } from 'lodash'
import { Instance } from './Instance'

export interface ChildrenArray extends Array<any> {
  push: (childVm: Instance) => number
  remove: (childVm: Instance) => Instance[]
}

function childrenArray (vm: Instance, array: any): ChildrenArray {
  array.push = function (childVm: Instance): number {
    const length: number = Array.prototype.push.apply(this, arguments)
    childVm.$parent = vm
    return length
  }
  array.remove = function (childVm: Instance): Instance[] {
    const index: number = this.indexOf(childVm)
    const result: any[] = Array.prototype.splice.call(this, index, 1)
    childVm.$destroy()
    return result
  }
  return array
}

export default class InstanceConstructor implements Instance {
  public readonly $id: string = uniqueId('App_')
  public readonly $el: HTMLElement
  public readonly $parent: Instance
  public readonly $data: any = {}
  public readonly $host: HTMLElement | null

  public styles: any = {}
  public template: string = ``
  public data: any = {}

  public $children: ChildrenArray = childrenArray(this, [])
  public $refs: any = {}

  public $destroy (): void {
    //
  }

  public $emit (type: string, ...args: any[]): void {
    //
  }
}