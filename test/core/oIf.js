import test from 'ava'
import sinon from 'sinon'
import oIf from 'core/oIf'

test('should do nothing if $el is undefined', t => {
  const vm = {}
  oIf(vm)
  t.pass()
})

test('should do nothing if the data key is not a boolean', t => {
  const el = document.createElement('div')
  el.innerHTML = `Hello, <span o-if="show">World</span>`
  const vm = {
    $id: 'abc',
    $el: el,
    data: {
      show: 0
    },
    show: 0
  }
  oIf(vm)
  t.is(vm.$el.innerHTML, `Hello, <span>World</span>`)
})

test('should remove element', t => {
  const el = document.createElement('div')
  el.innerHTML = `Hello, <span o-if="show">World</span>`
  const vm = {
    $id: 'abc',
    $el: el,
    data: {
      show: false
    },
    show: false
  }
  oIf(vm)
  t.is(vm.$el.innerHTML, `Hello, <!--${vm.$id}.show-->`)
})
