import { uniqueId } from 'lodash'
import createInstance, { Instance } from './Instance'
import apps from './apps'

export const ifSelector = 'o-if'

const dirs = {}

function App (this: Instance, el: HTMLElement, parent: HTMLElement, comment: HTMLElement) {
  const definition = apps(el.getAttribute('is') || '')
  const newVm = createInstance(definition, el)
  this.$children.push(newVm)
  parent.insertBefore(newVm.$host, comment.nextSibling)
  return newVm
}

function update (this: Instance, el: HTMLElement, binding: any, initialTrue: boolean = false) {
  const dir = dirs[binding.id]
  if (!binding.value) {
    if (dir.cachedVm != null) {
      this.$children.remove(dir.cachedVm)
      delete dir.cachedVm
      return
    }
    dir.parentEl.removeChild(dir.commentEl.nextSibling)
    return
  }
  const newNode = dir.cloneNode.cloneNode(true)
  if (newNode.hasAttribute('is')) {
    if (initialTrue) {
      dir.parentEl.removeChild(dir.commentEl.nextSibling)
    }
    dir.cachedVm = App.call(this, newNode, dir.parentEl, dir.commentEl)
    return
  }
  if (!initialTrue) {
    dir.parentEl.insertBefore(newNode, dir.commentEl.nextSibling)
  }
}

export default {
  bind (this: Instance, el: HTMLElement, binding: any) {
    binding.id = uniqueId(uniqueId('oIf_'))
    const cloneNode = el.cloneNode(true)
    const commentContent = `${this.$id}.${binding.expression}`
    const commentEl = document.createComment(commentContent)
    const parentEl = el.parentElement as HTMLElement
    parentEl.insertBefore(commentEl, el)
    dirs[binding.id] = {
      cloneNode,
      commentContent,
      commentEl,
      parentEl
    }
    update.call(this, el, binding, !!binding.value)
  },
  update,
  unbind (el: HTMLElement, binding: any) {
    delete dirs[binding.id]
  }
}
