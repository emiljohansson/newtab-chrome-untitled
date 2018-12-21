import * as sinon from 'sinon'
import mount from '../../src/core/mount'

test('should call methods in vm', () => {
  const mounted = sinon.spy()

  const vm = {
    mounted
  }
  mount(vm)
  const order = [
    mounted
  ]
  sinon.assert.callOrder.apply(null, order)
})
