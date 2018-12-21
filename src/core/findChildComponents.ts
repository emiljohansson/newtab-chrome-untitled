import { filter, forEach } from 'lodash'
import apps from './apps'
import Instance from './Instance'
import { ifSelector } from './oIf'

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
    : filter(el.shadowRoot.children, childEl => childEl !== el) // fixes bug in tests where extra shadowRoot is added within it-self
  return [...shadow, ...base]
}

export default vm => {
  let children = filter(
    getChildElements(vm.$host),
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
    el.removeAttribute('o-ref')
    vm.$refs[ref] = el
  })
}
