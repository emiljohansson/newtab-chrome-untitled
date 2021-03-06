import { camelCase, filter, forEach } from 'lodash'
import { getDirectiveAttributes } from './directives'
import { Instance } from './Instance'

export default (vm: Instance, el: HTMLElement) => {
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
