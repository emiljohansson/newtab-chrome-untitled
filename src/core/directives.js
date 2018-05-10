import { forEach, isFunction, isPlainObject, keys, noop } from 'lodash'
import watch from 'core/watch'

const list = {}

const defaultDirective = directive => {
  if (isFunction(directive)) {
    directive.bind = directive
    directive.update = directive
  } else {
    directive.bind = directive.bind || noop
    directive.update = directive.update || noop
  }
  directive.unbind = directive.unbind || noop
}

const getObjectLiteralValue = (vm, el, expression, onUpdate, binding) => {
  const valueChanged = expression => newValue => {
    binding.oldValue = binding.value
    if (isPlainObject(binding.value)) {
      binding.value[expression] = newValue
    } else {
      binding.value = newValue
    }
    onUpdate.call(vm, el, binding)
  }
  binding.expression = expression
  if (expression[0] === '{') {
    return toObjectLiteral(vm, expression, valueChanged)
  }
  if (expression === '') {
    return
  }
  const subject = watch(vm, expression)
  subject.subscribe(valueChanged(expression))
  return vm[expression]
}

const toObjectLiteral = (vm, expression, onUpdate) => {
  const result = {}
  const separation = expression
    .replace(/ /g, '')
    .replace(/\r?\n|\r/g, '')
    .replace('{', '')
    .replace('}', '')
    .split(',')
  const groups = separation.map(s => s.split(':'))
  forEach(groups, group => {
    const key = group[0]
    const value = group[1]
    result[key] = fixValue(key, value, vm, onUpdate)
  })
  return result
}

const fixValue = (expression, value, vm, valueChanged) => {
  if (value.match(/["']/g) != null) {
    return value.replace(/["']/g, '')
  }
  const subject = watch(vm, value)
  subject.subscribe(valueChanged(expression))
  return vm[value]
}

export const remove = name => {
  delete list[name]
}

export const add = (name, definition) => {
  if (list[name] != null) {
    throw new Error(`${name} directive is already defined`)
  }
  list[name] = definition
}

export const getDirectiveAttributes = () => keys(list)

export const directives = vm => {
  if (vm.$host == null) {
    return
  }
  forEach(getDirectiveAttributes(), selector => {
    const directive = list[selector]
    const elements = [
      ...vm.$host.querySelectorAll(`[${selector}]`),
      ...vm.$host.shadowRoot.querySelectorAll(`[${selector}]`)
    ]
    forEach(elements, el => {
      const expression = el.getAttribute(`${selector}`)
      const binding = {}
      el.removeAttribute(selector)
      defaultDirective(directive)
      binding.name = selector
      binding.value = getObjectLiteralValue(vm, el, expression, directive.update, binding)
      directive.bind.call(vm, el, binding)

      const destroySubject = watch(vm, '$destroy')
      destroySubject.subscribe(() => {
        directive.unbind(el, binding)
      })
    })
  })
}
