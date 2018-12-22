import * as sinon from 'sinon'
import init from '../../src/core/init'

test('should call methods in vm', () => {
  const beforeCreate: any = sinon.spy()
  const created: any = sinon.spy()
  const beforeMount: any = sinon.spy()

  const vm: any = {
    beforeCreate,
    created,
    beforeMount
  }
  init(vm, null)
  const order = [
    beforeCreate,
    created,
    beforeMount
  ]
  sinon.assert.callOrder.apply(null, order)
})

// TODO init injections & reactivity
