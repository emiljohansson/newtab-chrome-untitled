import test from 'ava'
import sinon from 'sinon'
import destroy from 'core/destroy'

test('should call methods in order', t => {
  const beforeDestroy = sinon.spy()
  const destroyed = sinon.spy()

  const vm = {
    $children: [],
    $refs: {},
    beforeDestroy,
    destroyed
  }
  destroy(vm)
  const order = [
    beforeDestroy,
    destroyed
  ]
  vm.$destroy()
  sinon.assert.callOrder.apply(null, order)
  t.pass()
})

test('should remove element', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const vm = {
    $children: [],
    $refs: {},
    $host: el
  }
  destroy(vm)
  vm.$destroy()
  t.is(document.body.children.length, 0)
})
