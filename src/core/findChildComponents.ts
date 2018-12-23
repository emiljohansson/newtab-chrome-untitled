import { filter, forEach, toArray, toString } from 'lodash'
import apps from './apps'
import instanceFactory, { Instance } from './Instance'
import { ifSelector } from './oIf'

const getChildElements = (el?: HTMLElement | null): HTMLElement[] => {
  if (!el) {
    return []
  }
  const children: HTMLElement[] = getChildren(el)
  let elements: HTMLElement[] = filter(children, el => el.toString() !== '[object Text]')
  let index: number = children.length
  while (index--) {
    elements = elements.concat(getChildElements(children[index]))
  }
  return elements
}

const getChildren = (el: HTMLElement): HTMLElement[] => {
  const base: Element[] = toArray(el.children)
  const shadow = el.shadowRoot === null
    ? []
    : filter(el.shadowRoot.children, (childEl: Element) => childEl !== el) // fixes bug in tests where extra shadowRoot is added within it-self
  return [...shadow, ...base] as HTMLElement[]
}

export default (vm: Instance) => {
  let children = filter(
    getChildElements(vm.$host),
    el => (el.hasAttribute('is') || el.hasAttribute('o-ref')) && !el.hasAttribute(ifSelector)
  )
  if (children.length < 1) {
    return
  }
  children = filter(children, (childEl: HTMLElement) => children.indexOf(childEl.parentElement as HTMLElement) < 0)
  forEach(children, el => {
    const id: string | null = el.getAttribute('is')
    const ref: string = toString(el.getAttribute('o-ref'))
    if (id !== null) {
      const childVm = instanceFactory(apps(id), el)
      vm.$children.push(childVm)
      vm.$refs[ref] = childVm
      return
    }
    el.removeAttribute('o-ref')
    vm.$refs[ref] = el
  })
}
