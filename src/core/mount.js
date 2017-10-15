import callHook from 'core/callHook'

export default vm => {
  callHook(vm, vm.mounted)
}
