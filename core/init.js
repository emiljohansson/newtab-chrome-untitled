import { filter, forEach, reduce, uniqueId } from 'lodash'
import getAllTextNodes from 'lib/getAllTextNodes'
import noop from 'lib/noop'
import replaceWithTemplate from 'core/replaceWithTemplate'
import storeAttributes from 'core/storeAttributes'
import apps from 'core/apps'
import callHook from 'core/callHook'
import Instance from 'core/Instance'
import oContent from 'core/oContent'
import { ifSelector } from 'core/oIf'

function ChildrenArray (vm, array) {
  array.push = function (childVm) {
    const length = Array.prototype.push.apply(this, arguments)
    childVm.$parent = vm
    return length
  }
  array.remove = function (childVm) {
    const index = this.indexOf(childVm)
    const result = Array.prototype.splice.call(this, index, 1)
    childVm.$destroy()
    return result
  }
  return array
}

const findChildComponents = vm => {
  let children = filter(
    getChildElements(vm.$el),
    el => el.hasAttribute('is') && !el.hasAttribute(ifSelector)
  )
  if (children.length < 1) {
    return
  }
  children = filter(children, childEl => children.indexOf(childEl.parentElement) < 0)
  forEach(children, el => {
    const id = el.getAttribute('is')
    const ref = el.getAttribute('o-ref')
    const childVm = Instance(apps(id), el)
    vm.$children.push(childVm)
    if (ref != null) {
      vm.$refs[ref] = childVm
    }
  })
}

const getChildElements = el => {
  if (el == null) {
    return []
  }
  let elements = filter(el.children, el => el.toString() !== '[object Text]')
  const children = el.children
  let index = children.length
  while (index--) {
    elements = elements.concat(getChildElements(children[index]))
  }
  return elements
}

export default (vm, el) => {
  vm.$id = uniqueId('App_')
  vm.$children = ChildrenArray(vm, [])
  vm.$refs = {}
  vm.data = vm.data || {}
  // TODO init events & lifecycle
  callHook(vm, vm.beforeCreate)
  // TODO init injections & reactivity
  callHook(vm, vm.created)
  callHook(vm, vm.beforeMount)
  storeAttributes(vm, el)
  vm.$el = el
  vm.$tempContent = (el || {}).innerHTML
  if (vm.$tempContent != null && vm.$tempContent.length < 1) {
    delete vm.$tempContent
  }
  replaceWithTemplate(vm)
  findChildComponents(vm)
  return vm
}
