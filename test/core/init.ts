import * as sinon from 'sinon'
import init from '../../src/core/init'

test('should create unique id', () => {
  const vm: any = {}
  init(vm, document.createElement('div'))
  expect(vm.$id.indexOf('App_')).toBe(0)
})

test('should call methods in vm', () => {
  const beforeCreate = sinon.spy()
  const created = sinon.spy()
  const beforeMount = sinon.spy()

  const vm: any = {
    beforeCreate,
    created,
    beforeMount
  }
  init(vm, document.createElement('div'))
  const order = [
    beforeCreate,
    created,
    beforeMount
  ]
  sinon.assert.callOrder.apply(null, order)
})

// TODO init injections & reactivity
