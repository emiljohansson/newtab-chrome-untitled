import test from 'ava'
import sinon from 'sinon'
import { isFunction, noop } from 'lodash'
import app from 'core/app'
import oEmit from 'core/oEmit'

test('should do nothing', t => {
  const vm = {}
  oEmit(vm)
  t.is(vm.$emit, noop)
})

test('should set $emit', t => {
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm = {
    $el: el
  }
  oEmit(vm)
  t.true(isFunction(vm.$emit))
  t.not(vm.$emit, noop)
})

test('should create a subject for each attribute', t => {
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  el.setAttribute('o-emit-foo-bar', '')
  const vm = {
    $el: el
  }
  oEmit(vm)
  t.true(isFunction(vm.$listeners.increment.next))
  t.true(isFunction(vm.$listeners.fooBar.next))
})

test('should call subject', t => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('o-emit-increment', '')
  const vm = {
    $el: el,
    $parent: {}
  }
  oEmit(vm)
  vm.$listeners.increment.subscribe(callback)
  vm.$emit('increment')
  t.is(callback.callCount, 1)
  vm.$emit('bad-param')
  t.is(callback.callCount, 1)
})
