import { forEach, keys } from '../../node_modules/lodash-es/lodash.js'

export default function (el, binding) {
  const classNames = keys(binding.value)
  forEach(classNames, className => {
    el.classList.toggle(className, binding.value[className])
  })
}
