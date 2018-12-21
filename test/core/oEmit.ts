import * as sinon from 'sinon'
import { isFunction, noop } from 'lodash'
import oEmit from '../../src/core/oEmit'

test('should do nothing', () => {
  const vm : any= {}
  oEmit(vm)
  expect(vm.$emit).toBe(noop)
})

test('should set $emit', () => {
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm: any = {
    $el: el
  }
  oEmit(vm)
  expect(isFunction(vm.$emit)).toBeTruthy()
  expect(vm.$emit === noop).toBeFalsy()
})

test('should create a subject for each attribute', () => {
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  el.setAttribute('o-emit-foo-bar', '')
  const vm: any = {
    $el: el
  }
  oEmit(vm)
  expect(isFunction(vm.$listeners.increment.next)).toBeTruthy()
  expect(isFunction(vm.$listeners.fooBar.next)).toBeTruthy()
})

test('should call subject', () => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm: any = {
    $el: el,
    $parent: {}
  }
  oEmit(vm)
  vm.$listeners.increment.subscribe(callback)
  vm.$emit('increment')
  expect(callback.callCount).toBe(1)
  vm.$emit('bad-param')
  expect(callback.callCount).toBe(1)
})
