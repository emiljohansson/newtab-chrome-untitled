import { filter, forEach, map, reduce } from 'lodash'

const onSelector = 'o-on-'

const types = [
  'click',
  'mousedown',
  'mousemove',
  'mouseup',
  'keydown',
  'keyup'
]

const ElementListener = el =>
  filter(
    map(types, type => {
      const attribute = `${onSelector}${type}`
      const elements = []
      const childEls = el.querySelectorAll(`[${attribute}]`)
      if (el.hasAttribute(attribute)) {
        elements.push(el)
      }
      if (childEls.length) {
        forEach(childEls, el => {
          elements.push(el)
        })
      }
      return {
        type,
        elements
      }
    }),
    elementListener => elementListener.elements.length
  )

const parse = vm => elementListener => {
  const { type, elements } = elementListener
  return map(elements, el => {
    const attribute = `${onSelector}${type}`
    const inlineFn = el.getAttribute(attribute)
    const groups = inlineFn.split('(').join(' ').split(')').join('').split(' ')
    const fn = groups[0]
    const stringArgs = groups.slice(1)
    const handler = event => {
      const args = stringArgs.length
        ? stringArgs.map(string => {
            // if (string === '$event') {
            //   return event
            // }
            // if (string === 'index') {
            //   return index
            // }
            // return data
            return event
          })
        : []
      vm[fn].apply(vm, args)
    }
    el.addEventListener(type, handler)
    el.removeAttribute(attribute)
    return () => {
      el.removeEventListener(type, handler)
    }
  })
}

export default (vm) => {
  if (vm.$el == null) {
    return
  }
  const elementListeners = ElementListener(vm.$el)
  const iteratee = parse(vm)
  vm.$removeDomHandlers = reduce(
    elementListeners,
    (array, elementListener) => array.concat(iteratee(elementListener)),
    []
  )
}
