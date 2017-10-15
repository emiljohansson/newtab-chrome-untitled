import test from 'ava'
import sinon from 'sinon'
import mount from 'core/mount'

test('should call methods in vm', t => {
  const mounted = sinon.spy()

  const vm = {
    mounted
  }
  mount(vm)
  const order = [
    mounted
  ]
  sinon.assert.callOrder.apply(null, order)
  t.pass()
})
