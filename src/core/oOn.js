export const onSelector = 'o-on-'

export const onTypes = [
  'click',
  'mousedown',
  'mousemove',
  'mouseup',
  'keydown',
  'keyup'
]

export default {
  bind (el, binding) {
    const attribute = binding.name
    const type = binding.name.replace(onSelector, '')
    const inlineFn = binding.expression
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
      this[fn].apply(this, args)
    }
    el.addEventListener(type, handler)
    el.removeAttribute(attribute)
    binding.removeListener = () => {
      el.removeEventListener(type, handler)
    }
  },
  unbind (el, binding) {
    binding.removeListener()
  }
}
