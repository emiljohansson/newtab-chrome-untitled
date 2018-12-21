import test from 'ava'
import * as sinon from 'sinon'
import init from 'core/init'

test('should create unique id', t => {
  const vm = {}
  init(vm)
  t.is(vm.$id.indexOf('App_'), 0)
})

test('should call methods in vm', t => {
  const beforeCreate = sinon.spy()
  const created = sinon.spy()
  const beforeMount = sinon.spy()

  const vm = {
    beforeCreate,
    created,
    beforeMount
  }
  init(vm)
  const order = [
    beforeCreate,
    created,
    beforeMount
  ]
  sinon.assert.callOrder.apply(null, order)
  t.pass()
})

// TODO init injections & reactivity
