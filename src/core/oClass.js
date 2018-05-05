import { forEach, keys } from 'lodash'

function update (el, binding) {
  const classNames = keys(binding.value)
  forEach(classNames, className => {
    el.classList.toggle(className, binding.value[className])
  })
}

export default {
  bind (el, binding) {
    update.call(this, el, binding)
  },
  update
}
