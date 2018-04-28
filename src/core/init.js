import { filter, forEach, uniqueId } from 'lodash'
import replaceWithTemplate from 'core/replaceWithTemplate'
import storeAttributes from 'core/storeAttributes'
import apps from 'core/apps'
import callHook from 'core/callHook'
import Instance from 'core/Instance'
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
    el => (el.hasAttribute('is') || el.hasAttribute('o-ref')) && !el.hasAttribute(ifSelector)
  )
  if (children.length < 1) {
    return
  }
  children = filter(children, childEl => children.indexOf(childEl.parentElement) < 0)
  forEach(children, el => {
    const id = el.getAttribute('is')
    const ref = el.getAttribute('o-ref')
    if (id != null) {
      const childVm = Instance(apps(id), el)
      vm.$children.push(childVm)
      if (ref != null) {
        vm.$refs[ref] = childVm
      }
      return
    }
    if (ref != null) {
      el.removeAttribute('o-ref')
      vm.$refs[ref] = el
      // return
    }
  })
}

const getChildElements = el => {
  if (el == null) {
    return []
  }
  const children = getChildren(el)
  let elements = filter(children, el => el.toString() !== '[object Text]')
  let index = children.length
  while (index--) {
    elements = elements.concat(getChildElements(children[index]))
  }
  return elements
}

const getChildren = el => {
  const base = el.children
  const shadow = el.shadowRoot == null
    ? []
    : el.shadowRoot.children
  return [...shadow, ...base]
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
