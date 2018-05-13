import { forEach } from '../../node_modules/lodash-es/lodash.js'
import BaseApp from './BaseApp.js'
import destroy from './destroy.js'
import mount from './mount.js'
import init from './init.js'
import state from './state.js'
import oFor from './oFor.js'
import oIf from './oIf.js'
import oClass from './oClass.js'
import oOn, { onSelector, onTypes } from './oOn.js'
import directive from './directive.js'
import { directives } from './directives.js'
import findChildComponents from './findChildComponents.js'

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
