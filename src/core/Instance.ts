import { forEach } from 'lodash'
import BaseApp from './BaseApp'
import destroy from './destroy'
import mount from './mount'
import init from './init'
import state from './state'
import oFor from './oFor'
import oIf from './oIf'
import oClass from './oClass'
import oOn, { onSelector, onTypes } from './oOn'
import directive from './directive'
import { directives } from './directives'
import findChildComponents from './findChildComponents'
import { ChildrenArray } from './InstanceConstructor'

export interface InstanceOptions<I extends Instance> {
  data?: any
  styles?: any
  template?: any
}

export interface Instance {
  $id: string
  $parent?: Instance
  $children: ChildrenArray
  $data: any
  $refs: any
  $host: HTMLElement | null
  $el?: HTMLElement
  data: any
  styles: any
  template?: string
  beforeDestroy?: () => void
  destroyed?: () => void
  beforeCreate?: () => void
  created?: () => void
  beforeMount?: () => void
  $destroy: () => void
  $emit: (type: string, ...args: any[]) => void
}

directive('o-class', oClass)
directive('o-for', oFor)
directive('o-if', oIf)
forEach(onTypes, (onType: string) => {
  directive(`${onSelector}${onType}`, oOn)
})

function instanceFactory (definition: any, el: HTMLElement | null, context?: any): Instance {
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

export default instanceFactory
