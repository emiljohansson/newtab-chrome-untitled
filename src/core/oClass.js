import { forEach, keys } from 'lodash-es'

export default function (el, binding) {
  const classNames = keys(binding.value)
  forEach(classNames, className => {
    el.classList.toggle(className, binding.value[className])
  })
}
