import * as sinon from 'sinon'
import { isFunction, noop } from 'lodash'
import instanceFactory from '../../src/core/Instance'

test('should set $emit', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm: any = instanceFactory({}, el)
  expect(isFunction(vm.$emit)).toBeTruthy()
  expect(vm.$emit === noop).toBeFalsy()
  vm.$destroy()
})

test('should create a subject for each attribute', () => {
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  el.setAttribute('o-emit-foo-bar', '')
  const vm: any = instanceFactory({}, el)
  expect(isFunction(vm.$listeners.increment.next)).toBeTruthy()
  expect(isFunction(vm.$listeners.fooBar.next)).toBeTruthy()
  vm.$destroy()
})

test('should call subject', () => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm: any = instanceFactory({}, el)
  vm.$parent = {}
  vm.$listeners.increment.subscribe(callback)
  vm.$emit('increment')
  expect(callback.callCount).toBe(1)
  vm.$emit('bad-param')
  expect(callback.callCount).toBe(1)
  vm.$destroy()
})

test('should not call subject without $parent', () => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm: any = instanceFactory({}, el)
  vm.$emit('increment')
  expect(callback.callCount).toBe(0)
  vm.$destroy()
})
