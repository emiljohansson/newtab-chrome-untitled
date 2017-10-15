import { forEach, toArray } from 'lodash'
import watch from 'core/watch'

const classSelector = 'o-class'

export default vm => {
  if (vm.$el == null) {
    return
  }
  let elements = []
  if (vm.$el.hasAttribute(`${classSelector}`)) {
    elements.push(vm.$el)
  }
  elements = elements.concat(toArray(vm.$el.querySelectorAll(`[${classSelector}]`)))
  if (elements.length < 1) {
    return
  }
  forEach(elements, el => {
    const separation = el.getAttribute(`${classSelector}`)
      .replace(/ /g, '')
      .replace(/\r?\n|\r/g, '')
      .replace('{', '')
      .replace('}', '')
      .split(',')
    const groups = separation.map(s => s.split(':'))
    forEach(groups, group => {
      const className = group[0]
      const key = group[1]
      const toggle = () => {
        el.classList.toggle(className, vm[key])
      }
      const subject = watch(vm, key)
      subject.subscribe(toggle)
      toggle(className, vm[key])
    })
    el.removeAttribute(`${classSelector}`)
  })
}
