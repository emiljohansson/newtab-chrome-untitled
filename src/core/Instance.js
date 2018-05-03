import BaseApp from 'core/BaseApp'
import destroy from 'core/destroy'
import mount from 'core/mount'
import init from 'core/init'
import state from 'core/state'
import oFor from 'core/oFor'
import oIf from 'core/oIf'

export default (definition, el, context) => {
  const vm = BaseApp(definition)
  if (context != null) {
    Object.assign(vm.data, context)
  }
  init(vm, el)
  state(vm)
  oIf(vm)
  oFor(vm)
  mount(vm)
  destroy(vm)
  return vm
}
