import { forEach, isBoolean } from 'lodash'
import Instance from 'core/Instance'
import apps from 'core/apps'
import watch from 'core/watch'

export const ifSelector = 'o-if'

export default vm => {
  if (vm.$el == null) {
    return
  }
  let elements = [...vm.$el.querySelectorAll(`[${ifSelector}]`)]
  if (vm.$el.shadowRoot != null) {
    elements = elements.concat(...vm.$el.shadowRoot.querySelectorAll(`[${ifSelector}]`))
  }
  forEach(elements, el => {
    const key = el.getAttribute(ifSelector)
    el.removeAttribute(ifSelector)
    if (!isBoolean(vm[key])) {
      return
    }
    const cloneNode = el.cloneNode(true)
    const parent = el.parentElement
    const commentContent = `${vm.$id}.${key}`
    const comment = document.createComment(commentContent)
    let cachedVm
    parent.insertBefore(comment, el)
    const update = value => {
      if (value === false) {
        if (cachedVm != null) {
          vm.$children.remove(cachedVm)
          cachedVm = undefined
          return
        }
        parent.removeChild(comment.nextSibling)
        return
      }
      const newNode = cloneNode.cloneNode(true)
      if (newNode.hasAttribute('is')) {
        cachedVm = App(newNode, parent, comment, {})
        return
      }
      parent.insertBefore(newNode, comment.nextSibling)
    }
    const subject = watch(vm, key)
    subject.subscribe(update)
    update(vm[key])
  })

  const App = (el, parent, comment, context) => {
    const definition = apps(el.getAttribute('is'))
    const newVm = Instance(definition, el, context)
    vm.$children.push(newVm)
    parent.insertBefore(newVm.$el, comment.nextSibling)
    return newVm
  }
}
