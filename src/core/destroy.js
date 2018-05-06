import callHook from 'core/callHook'
import { destroy as destroyWatchers } from 'core/watch'

export default vm => {
  vm.$destroy = () => {
    callHook(vm, vm.beforeDestroy)
    destroyWatchers(vm)
    delete vm.$refs
    if (vm.$removeDomHandlers != null) {
      while (vm.$removeDomHandlers.length) {
        const handler = vm.$removeDomHandlers.splice(0, 1)[0]
        handler()
      }
    }
    while (vm.$children.length) {
      const childVm = vm.$children[0]
      vm.$children.remove(childVm)
    }
    if (vm.$el != null) {
      if (vm.$el.parentElement == null) {
        vm.$el.parentNode.removeChild(vm.$el)
      } else {
        vm.$el.parentElement.removeChild(vm.$el)
      }
    }
    callHook(vm, vm.destroyed)
  }
}
