import { forEach } from 'lodash'
import BaseApp from 'core/BaseApp'
import destroy from 'core/destroy'
import mount from 'core/mount'
import init from 'core/init'
import state from 'core/state'
import oFor from 'core/oFor'
import oIf from 'core/oIf'
import oClass from 'core/oClass'
import oOn, { onSelector, onTypes } from 'core/oOn'
import directive from 'core/directive'
import { directives } from 'core/directives'
import findChildComponents from 'core/findChildComponents'

directive('o-class', oClass)
directive('o-for', oFor)
directive('o-if', oIf)
forEach(onTypes, onType => {
  directive(`${onSelector}${onType}`, oOn)
})

export default (definition, el, context) => {
  const vm = BaseApp(definition)
  if (context != null) {
    Object.assign(vm.data, context)
  }
  init(vm, el)
  state(vm)
  directives(vm)
  findChildComponents(vm)
  mount(vm)
  destroy(vm)
  return vm
}
