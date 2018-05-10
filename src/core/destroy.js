import callHook from 'core/callHook'
import { destroy as destroyWatchers } from 'core/watch'

export default vm => {
  vm.$destroy = () => {
    callHook(vm, vm.beforeDestroy)
    destroyWatchers(vm)
    delete vm.$refs
    while (vm.$children.length) {
      const childVm = vm.$children[0]
      vm.$children.remove(childVm)
    }
    if (vm.$host != null) {
      if (vm.$host.parentElement == null) {
        vm.$host.parentNode.removeChild(vm.$host)
      } else {
        vm.$host.parentElement.removeChild(vm.$host)
      }
    }
    callHook(vm, vm.destroyed)
  }
}
