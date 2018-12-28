import oEmit from './oEmit'
import replaceWithTemplate from './replaceWithTemplate'
import storeAttributes from './storeAttributes'
import callHook from './callHook'
import { Instance } from './Instance'
import initRender from './render'

export default (vm: Instance, el: HTMLElement | null) => {
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
  if (typeof (vm as any).render === 'undefined') {
    replaceWithTemplate(vm)
  } else {
    initRender(vm)
  }
  return vm
}
