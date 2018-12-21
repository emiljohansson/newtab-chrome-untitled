import { camelCase, filter, forEach } from 'lodash'
import { getDirectiveAttributes } from './directives'

export default (vm, el: HTMLElement) => {
  if (!el) {
    return
  }
  el.removeAttribute('is')
  const directives = getDirectiveAttributes()
  const attributes = filter(
    el.attributes,
    item => {
      return item.name.slice(0, 2) !== 'o-' && directives.indexOf(item.name) < 0
    }
  )
  forEach(attributes, item => {
    vm.data[camelCase(item.name)] = item.value
    el.removeAttribute(item.name)
  })
}
