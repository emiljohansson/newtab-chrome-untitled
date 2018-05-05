import BaseApp from 'core/BaseApp'
import destroy from 'core/destroy'
import mount from 'core/mount'
import init from 'core/init'
import state from 'core/state'
import oFor from 'core/oFor'
import oIf from 'core/oIf'
import oClass from 'core/oClass'
import oOn from 'core/oOn'
import directive from 'core/directive'
import { directives } from 'core/directives'

directive('o-class', oClass)

export default (definition, el, context) => {
  const vm = BaseApp(definition)
  if (context != null) {
    Object.assign(vm.data, context)
  }
  init(vm, el)
  oOn(vm)
  state(vm)
  oIf(vm)
  oFor(vm)
  directives(vm)
  mount(vm)
  destroy(vm)
  return vm
}
