import { toArray } from '../../node_modules/lodash-es/lodash.js'

export default (element, selector) => {
  if (element == null) {
    return []
  }
  // [element].concat(
  return toArray(element.querySelectorAll(`[${selector}]`))
}
