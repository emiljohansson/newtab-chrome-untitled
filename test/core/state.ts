import test from 'ava'
import * as sinon from 'sinon'
import state from 'core/state'

test('should bind options.data to vm.$data', t => {
  const data = {
    a: 1
  }
  const vm = {
    data
  }
  state(vm)
  t.deepEqual(vm.$data, data)
  t.is(vm.a, 1)
})

test('should update key value after change', t => {
  const data = {
    a: 1,
    b: 'Foo'
  }
  const vm = {
    data
  }
  state(vm)
  vm.a = 2
  vm.b = 'Bar'
  t.is(vm.a, 2)
  t.is(vm.b, 'Bar')
  t.is(vm.data.a, 2)
  t.is(vm.data.b, 'Bar')
})

test('should call beforeUpdate before updating the value', t => {
  const callback = sinon.spy()
  const data = {
    a: 1
  }
  const vm = {
    data,
    beforeUpdate: callback
  }
  state(vm)
  vm.a = 2
  t.true(callback.called)
})

test('should call methods in vm', t => {
  const beforeUpdate = sinon.spy()
  const updated = sinon.spy()
  const vm = {
    data: {
      a: 1
    },
    beforeUpdate,
    updated
  }
  state(vm)
  const order = [
    beforeUpdate,
    updated
  ]
  vm.a = 2
  sinon.assert.callOrder.apply(null, order)
  t.pass()
})

test('should watch arrays', t => {
  const beforeUpdate = sinon.spy()
  const updated = sinon.spy()
  const obj1 = {id: 1}
  const obj2 = {id: 2}
  const vm = {
    data: {
      a: [obj1, obj2]
    },
    beforeUpdate,
    updated
  }
  state(vm)
  const order = [
    beforeUpdate,
    updated
  ]
  vm.a.push({id: 3})
  sinon.assert.callOrder.apply(null, order)
  t.true(vm.a[0] === obj1)
  t.true(vm.a[1] === obj2)
})
