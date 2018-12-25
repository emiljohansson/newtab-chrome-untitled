import { forEach, isFunction, isPlainObject, keys, noop, toString } from 'lodash'
import watch from './watch'
import { Instance } from './Instance'
import { Subject } from './Subject'

interface Directive {
  bind: () => void
  unbind: () => void
  update: () => void
}

const list: any = {}

const defaultDirective = (directive: Directive): void => {
  if (isFunction(directive)) {
    directive.bind = directive
    directive.update = directive
  } else {
    directive.bind = directive.bind || noop
    directive.update = directive.update || noop
  }
  directive.unbind = directive.unbind || noop
}

const getObjectLiteralValue = (vm: Instance, el: HTMLElement, expression: string, onUpdate: any, binding: any) => {
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

const toObjectLiteral = (vm: Instance, expression: string, onUpdate: any) => {
  const result = {}
  const separation = expression
    .replace(/ /g, '')
    .replace(/\r?\n|\r/g, '')
    .replace('{', '')
    .replace('}', '')
    .split(',')
  const groups = separation.map((s: string) => s.split(':'))
  forEach(groups, group => {
    const key = group[0]
    const value = group[1]
    result[key] = fixValue(key, value, vm, onUpdate)
  })
  return result
}

const fixValue = (expression: string, value: string, vm: Instance, valueChanged: any) => {
  if (value.match(/["']/g) !== null) {
    return value.replace(/["']/g, '')
  }
  const subject = watch(vm, value)
  subject.subscribe(valueChanged(expression))
  return vm[value]
}

export const remove: any = name => {
  delete list[name]
}

export const add: any = (name: string, definition: any) => {
  if (list[name] != null) {
    throw new Error(`${name} directive is already defined`)
  }
  list[name] = definition
}

export const getDirective: any = (name: string): any => list[name]

export const getDirectiveAttributes: any = () => keys(list)

export const directives: any = (vm: any) => {
  if (!vm.$host) {
    return
  }
  forEach(getDirectiveAttributes(), (selector: string) => {
    const directive: any = getDirective(selector)
    const elements: HTMLElement[] = [
      ...vm.$host.querySelectorAll(`[${selector}]`),
      ...vm.$el.querySelectorAll(`[${selector}]`)
    ]
    forEach(elements, initDirective(vm, selector, directive))
  })
}

export const initDirective: any = (vm: Instance, selector: string, directive: any, context: any = {}): (el: HTMLElement) => void =>
  (el: HTMLElement): void => {
    const expression: string = toString(el.getAttribute(`${selector}`))
    const binding: any = {}
    el.removeAttribute(selector)
    defaultDirective(directive)
    binding.name = selector
    binding.value = getObjectLiteralValue(vm, el, expression, directive.update, binding)
    directive.bind.call(vm, el, binding, context)

    const destroySubject: Subject<any> = watch(vm, '$destroy')
    destroySubject.subscribe(() => {
      directive.unbind(el, binding)
    })
  }
