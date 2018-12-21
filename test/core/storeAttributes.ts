import test from 'ava'
import storeAttributes from 'core/storeAttributes'

test('should do nothing', t => {
  const vm = {
    data: {}
  }
  storeAttributes(vm)
  t.deepEqual(vm.data, {})
})

test('should append to context', t => {
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

test('should not store any attributes atrting with `o-`', t => {
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
