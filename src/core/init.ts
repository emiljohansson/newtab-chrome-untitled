import { uniqueId } from 'lodash'
import oEmit from './oEmit'
import replaceWithTemplate from './replaceWithTemplate'
import storeAttributes from './storeAttributes'
import callHook from './callHook'

function ChildrenArray (vm, array) {
  array.push = function (childVm) {
    const length = Array.prototype.push.apply(this, arguments)
    childVm.$parent = vm
    return length
  }
  array.remove = function (childVm) {
    const index = this.indexOf(childVm)
    const result = Array.prototype.splice.call(this, index, 1)
    childVm.$destroy()
    return result
  }
  return array
}

export default (vm, el) => {
  vm.$id = uniqueId('App_')
  vm.$children = ChildrenArray(vm, [])
  vm.$refs = {}
  vm.data = vm.data || {}
  // TODO init events & lifecycle
  callHook(vm, vm.beforeCreate)
  // TODO init injections & reactivity
  callHook(vm, vm.created)
  callHook(vm, vm.beforeMount)
  storeAttributes(vm, el)
  vm.$el = el
  oEmit(vm)
  replaceWithTemplate(vm)
  return vm
}
