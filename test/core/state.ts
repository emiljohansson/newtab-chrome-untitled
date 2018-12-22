import * as sinon from 'sinon'
import state from '../../src/core/state'

test('should bind options.data to vm.$data', () => {
  const data = {
    a: 1
  }
  const vm: any = {
    $data: {},
    data
  }
  state(vm)
  expect(vm.$data).toEqual(data)
  expect(vm.a).toBe(1)
})

test('should update key value after change', () => {
  const data = {
    a: 1,
    b: 'Foo'
  }
  const vm: any = {
    $data: {},
    data
  }
  state(vm)
  vm.a = 2
  vm.b = 'Bar'
  expect(vm.a).toBe(2)
  expect(vm.b).toBe('Bar')
  expect(vm.$data.a).toBe(2)
  expect(vm.$data.b).toBe('Bar')
  expect(vm.data.a).toBe(1)
  expect(vm.data.b).toBe('Foo')
})

test('should call beforeUpdate before updating the value', () => {
  const callback = sinon.spy()
  const data = {
    a: 1
  }
  const vm: any = {
    $data: {},
    data,
    beforeUpdate: callback
  }
  state(vm)
  vm.a = 2
  expect(callback.called).toBeTruthy()
})

test('should call methods in vm', () => {
  const beforeUpdate: any = sinon.spy()
  const updated: any = sinon.spy()
  const vm: any = {
    $data: {},
    data: {
      a: 1
    },
    beforeUpdate,
    updated
  }
  state(vm)
  const order: any[] = [
    beforeUpdate,
    updated
  ]
  vm.a = 2
  sinon.assert.callOrder.apply(null, order)
})

test('should watch arrays', () => {
  const beforeUpdate = sinon.spy()
  const updated = sinon.spy()
  const obj1 = { id: 1 }
  const obj2 = { id: 2 }
  const vm: any = {
    $data: {},
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
  vm.a.push({ id: 3 })
  sinon.assert.callOrder.apply(null, order)
  expect(vm.a[0] === obj1).toBeTruthy()
  expect(vm.a[1] === obj2).toBeTruthy()
})
