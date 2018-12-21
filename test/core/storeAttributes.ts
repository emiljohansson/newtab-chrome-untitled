import storeAttributes from '../../src/core/storeAttributes'

test('should do nothing', () => {
  const vm = {
    data: {}
  }
  storeAttributes(vm)
  expect(vm.data).toEqual({})
})

test('should append to context', () => {
  const el = document.createElement('div')
  el.setAttribute('is', 'FooBar')
  el.setAttribute('foo', 'bar')
  const vm = {
    data: {}
  }
  storeAttributes(vm, el)
  expect(vm.data).toEqual({
    foo: 'bar'
  })
})

test('should not store any attributes atrting with `o-`', () => {
  const el = document.createElement('div')
  el.setAttribute('is', 'FooBar')
  el.setAttribute('foo', 'bar')
  el.setAttribute('o-on-click', 'onClick')
  el.setAttribute('o-emit-increment', 'onIncrement')
  const vm = {
    data: {}
  }
  storeAttributes(vm, el)
  expect(vm.data).toEqual({
    foo: 'bar'
  })
})
