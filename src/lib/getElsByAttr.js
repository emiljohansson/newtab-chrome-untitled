import { toArray } from 'lodash'

export default (element, selector) => {
  if (element == null) {
    return []
  }
  // [element].concat(
  return toArray(element.querySelectorAll(`[${selector}]`))
}
