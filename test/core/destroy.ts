import * as sinon from 'sinon'
import { noop } from 'lodash'
import destroyMixin from '../../src/core/destroy'
import { Instance } from '../../src/core/Instance'

const defaultInstance: any = (vm: any = {}): Instance => ({
  ...{
    $children: [],
    $refs: {},
    $host: null,
    beforeDestroy: noop,
    destroyed: noop,
    $destroy: noop
  },
  ...vm
})

test('should call methods in order', () => {
  const beforeDestroy = sinon.spy()
  const destroyed = sinon.spy()

  const vm: Instance = defaultInstance({
    beforeDestroy,
    destroyed
  })
  destroyMixin(vm)
  const order = [
    beforeDestroy,
    destroyed
  ]
  vm.$destroy()
  sinon.assert.callOrder.apply(null, order)
})

test('should remove element', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const vm: Instance = defaultInstance({
    $host: el
  })
  destroyMixin(vm)
  vm.$destroy()
  expect(document.body.children.length).toBe(0)
})
