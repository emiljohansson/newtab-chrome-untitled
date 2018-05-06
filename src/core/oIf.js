import { uniqueId } from 'lodash'
import Instance from 'core/Instance'
import apps from 'core/apps'

export const ifSelector = 'o-if'

const dirs = {}

function App (el, parent, comment) {
  const definition = apps(el.getAttribute('is'))
  const newVm = Instance(definition, el)
  this.$children.push(newVm)
  parent.insertBefore(newVm.$el, comment.nextSibling)
  return newVm
}

function update (el, binding, initialTrue = false) {
  const dir = dirs[binding.id]
  if (!!binding.value === false) {
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
  bind (el, binding) {
    binding.id = uniqueId(uniqueId('oIf_'))
    const cloneNode = el.cloneNode(true)
    const commentContent = `${this.$id}.${binding.expression}`
    const commentEl = document.createComment(commentContent)
    const parentEl = el.parentElement
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
  unbind (el, binding) {
    delete dirs[binding.id]
  }
}
