import { forEach } from 'lodash'
import BaseApp from './BaseApp'
import destroy from './destroy'
import mount from './mount'
import init, { Children } from './init'
import state from './state'
import oFor from './oFor'
import oIf from './oIf'
import oClass from './oClass'
import oOn, { onSelector, onTypes } from './oOn'
import directive from './directive'
import { directives } from './directives'
import findChildComponents from './findChildComponents'

export interface Instance {
  $id: string
  $parent: Instance
  $children: Children
  $refs: any
  $host: HTMLElement | null
  beforeDestroy: () => void
  destroyed: () => void
  $destroy: () => void
  $emit: (type, ...args: any[]) => void
}

directive('o-class', oClass)
directive('o-for', oFor)
directive('o-if', oIf)
forEach(onTypes, (onType: string) => {
  directive(`${onSelector}${onType}`, oOn)
})

export default (definition: any, el: HTMLElement | null, context?: any): any => {
  const vm: any = BaseApp(definition)
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
