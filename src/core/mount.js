import callHook from './callHook.js'

export default vm => {
  callHook(vm, vm.mounted)
}
