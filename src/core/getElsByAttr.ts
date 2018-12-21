import { toArray } from 'lodash'

export default (element: HTMLElement | null, selector: string): HTMLElement[] => {
  if (element === null) {
    return []
  }
  // [element].concat(
  return toArray(element.querySelectorAll(`[${selector}]`))
}
