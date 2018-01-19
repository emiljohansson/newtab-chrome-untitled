import { cloneDeep } from 'lodash'
import app from 'core/app'
import callHook from 'core/callHook'
import destroy from 'core/destroy'
import mount from 'core/mount'
import init from 'core/init'
import state from 'core/state'
import oFor from 'core/oFor'
import oIf from 'core/oIf'

app('BaseApp', require('core/BaseApp').default)

export default (definition, el, context) => {
  const vm = cloneDeep(definition)
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
