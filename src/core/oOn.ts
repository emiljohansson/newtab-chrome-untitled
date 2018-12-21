export const onSelector: string = 'o-on-'

export const onTypes: string[] = [
  'click',
  'mousedown',
  'mousemove',
  'mouseup',
  'keydown',
  'keyup'
]

export default {
  bind (el: HTMLElement, binding: any) {
    const attribute = binding.name
    const type = binding.name.replace(onSelector, '')
    const inlineFn = binding.expression
    const groups = inlineFn.split('(').join(' ').split(')').join('').split(' ')
    const fn = groups[0]
    const stringArgs = groups.slice(1)
    const handler = event => {
      const args = stringArgs.length
        ? stringArgs.map((value: string) => {
          // if (value === '$event') {
          //   return event
          // }
          // if (value === 'index') {
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
  unbind (el: HTMLElement, binding: any) {
    binding.removeListener()
  }
}
