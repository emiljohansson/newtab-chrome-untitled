import test from 'ava'
import sinon from 'sinon'
import { noop } from '../../node_modules/lodash-es/lodash.js'
import directive from 'core/directive'
import { remove } from 'core/directives'
import Instance from 'core/Instance'

test('should do nothing', t => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.innerHTML = `<span bar>Bar</span>`
  document.body.appendChild(el)
  directive('foo', callback)
  directive('bar', {})
  const vm = Instance({}, el)
  t.false(callback.called)
  vm.$destroy()
  remove('foo')
  remove('bar')
})

test('should call when found', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', el => {
    t.is(el.innerHTML, 'Foo')
  })
  vm = Instance({}, el)
  vm.$destroy()
  remove('foo-bar')
})

test('should throw error when already defined', t => {
  directive('foo-bar', noop)
  const error = t.throws(() => {
    directive('foo-bar', noop)
  }, Error)
  t.is(error.message, 'foo-bar directive is already defined')
  remove('foo-bar')
})

test('should call each element found', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span><span foo-bar>Bar</span>`
  document.body.appendChild(el)
  let index = 0
  directive('foo-bar', el => {
    t.is(el.innerHTML, index === 0 ? 'Foo' : 'Bar')
    index++
  })
  vm = Instance({}, el)
  t.is(index, 2)
  vm.$destroy()
  remove('foo-bar')
})

test('should call all directives', t => {
  const fooCallback = sinon.spy()
  const barCallback = sinon.spy()
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo>Foo</span><span bar>Bar</span>`
  document.body.appendChild(el)
  directive('foo', fooCallback)
  directive('bar', barCallback)
  vm = Instance({}, el)
  t.true(fooCallback.called)
  t.true(barCallback.called)
  vm.$destroy()
  remove('foo')
  remove('bar')
})

test('should not share bindings', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo>Foo</span><span foo>Bar</span>`
  document.body.appendChild(el)
  const bindings = []
  directive('foo', (el, binding) => {
    binding.id = 'foo' + bindings.length
    bindings.push(binding)
  })
  vm = Instance({}, el)
  t.is(bindings[0].id, 'foo0')
  t.is(bindings[1].id, 'foo1')
  vm.$destroy()
  remove('foo')
  remove('bar')
})

test('should link this to vm', t => {
  let vm
  let context
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', function (el, binding) {
    context = this
  })
  vm = Instance({
    data: {
      message: 'hello!'
    }
  }, el)
  t.is(context.message, vm.message)
  vm.$destroy()
  remove('foo-bar')
})

test('should bind binding.value to a data variable', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="message">Foo</span>`
  document.body.appendChild(el)
  let expected = 'hello 1'
  let count = 0
  let oldValue
  directive('foo-bar', {
    bind (el, binding) {
      t.is(binding.value, expected)
      t.is(binding.expression, 'message')
      count++
      oldValue = binding.value
    },
    update (el, binding) {
      t.is(binding.value, expected)
      t.is(binding.expression, 'message')
      t.is(binding.oldValue, oldValue)
      count++
    }
  })
  vm = Instance({
    data: {
      message: 'hello 1'
    }
  }, el)
  expected = 'hello 2'
  vm.message = expected
  t.is(count, 2)
  vm.$destroy()
  remove('foo-bar')
})

test('should convert object literal value to binding.value', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="{ border-color: 'white', text: 'hello!' }">Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', (el, binding) => {
    t.is(binding.value['border-color'], 'white')
    t.is(binding.value.text, 'hello!')
    t.is(binding.expression, `{ border-color: 'white', text: 'hello!' }`)
  })
  vm = Instance({}, el)
  vm.$destroy()
  remove('foo-bar')
})

test('should call same function for both bind and update', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="{ text: message }">Foo</span>`
  document.body.appendChild(el)
  let expected = 'hello 1'
  let count = 0
  let oldValue
  directive('foo-bar', function (el, binding) {
    t.is(binding.name, 'foo-bar')
    t.is(binding.value.text, expected)
    t.is(binding.oldValue, oldValue)
    oldValue = binding.value
    count++
  })
  vm = Instance({
    data: {
      message: 'hello 1'
    }
  }, el)
  expected = 'hello 2'
  vm.message = expected
  t.is(count, 2)
  vm.$destroy()
  remove('foo-bar')
})

test('should watch object literal values', t => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="{ text: message }">Foo</span>`
  document.body.appendChild(el)
  let expected = 'hello 1'
  let count = 0
  let oldValue
  directive('foo-bar', {
    bind (el, binding) {
      t.is(binding.value.text, expected)
      oldValue = binding.value
    },
    update (el, binding) {
      t.is(binding.value.text, expected)
      t.is(binding.oldValue, oldValue)
      count++
    }
  })
  vm = Instance({
    data: {
      message: 'hello 1'
    }
  }, el)
  expected = 'hello 2'
  vm.message = expected
  t.is(count, 1)
  vm.$destroy()
  remove('foo-bar')
})

test('should call unbind on destroy', t => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', {
    unbind: callback
  })
  const vm = Instance({}, el)
  vm.$destroy()
  t.true(callback.called)
  remove('foo-bar')
})
