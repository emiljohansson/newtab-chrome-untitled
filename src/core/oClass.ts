import { forEach, keys } from 'lodash'

export default function (el: HTMLElement, binding: any) {
  const classNames = keys(binding.value)
  forEach(classNames, className => {
    el.classList.toggle(className, binding.value[className])
  })
}
