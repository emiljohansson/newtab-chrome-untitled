import { uniqueId } from 'lodash'
import { Instance } from './Instance'
import callHook from './callHook'
import { destroy as destroyWatchers } from './watch'
import { Subject } from './Subject'

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
  public readonly $host: HTMLElement | null = null
  public readonly $listeners: any = {}

  public template: string = ``
  public styles: any = {}
  public data: any = {}

  public $children: ChildrenArray = childrenArray(this, [])
  public $refs: any = {}

  public $destroy (): void {
    callHook(this, (this as any).beforeDestroy)
    destroyWatchers(this)
    delete this.$refs
    while (this.$children.length) {
      const childVm = this.$children[0]
      this.$children.remove(childVm)
    }
    if (this.$host !== null) {
      if (this.$host.parentElement === null) {
        if (this.$host.parentNode) {
          this.$host.parentNode.removeChild(this.$host)
        }
      } else {
        this.$host.parentElement.removeChild(this.$host)
      }
    }
    callHook(this, (this as any).destroyed)
  }

  public $emit (type: string, ...args: any[]): void {
    const subject: Subject = this.$listeners[type]
    if (!subject) {
      return
    }
    subject.next(args)
  }
}
