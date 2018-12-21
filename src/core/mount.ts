import callHook from './callHook'

export default (vm: any) => {
  callHook(vm, vm.mounted)
}
