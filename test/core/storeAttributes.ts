import storeAttributes from '../../src/core/storeAttributes'

test('should do nothing', () => {
  const vm = {
    data: {}
  }
  storeAttributes(vm)
  t.deepEqual(vm.data, {})
})

test('should append to context', () => {
  const el = document.createElement('div')
  el.setAttribute('is', 'FooBar')
  el.setAttribute('foo', 'bar')
  const vm = {
    data: {}
  }
  storeAttributes(vm, el)
  t.deepEqual(vm.data, {
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
  t.deepEqual(vm.data, {
    foo: 'bar'
  })
})
