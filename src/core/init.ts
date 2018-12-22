import oEmit from './oEmit'
import replaceWithTemplate from './replaceWithTemplate'
import storeAttributes from './storeAttributes'
import callHook from './callHook'
import { Instance } from './Instance'

export interface Children {
  push: (childVm: Instance) => number
  remove: (childVm: Instance) => Instance[]
}

function ChildrenArray (vm: Instance, array: any): Children {
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

export default (vm: Instance, el: HTMLElement | null) => {
  vm.$children = ChildrenArray(vm, [])
  // TODO init events & lifecycle
  callHook(vm, vm.beforeCreate)
  // TODO init injections & reactivity
  callHook(vm, vm.created)
  callHook(vm, vm.beforeMount)
  if (el) {
    storeAttributes(vm, el)
    vm.$el = el
  }
  oEmit(vm)
  replaceWithTemplate(vm)
  return vm
}
