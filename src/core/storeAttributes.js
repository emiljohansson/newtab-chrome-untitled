import { filter, forEach, toArray } from 'lodash'

export default (vm, el) => {
  if (el == null) {
    return
  }
  el.removeAttribute('is')
  const attributes = filter(
    toArray(el.attributes),
    item => item.name.indexOf('o-') < 0
  )
  forEach(attributes, item => {
    vm.data[item.name] = item.value
    el.removeAttribute(item.name)
  })
}
