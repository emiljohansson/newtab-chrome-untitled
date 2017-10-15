import test from 'ava'
import oClass from 'core/oClass'

test('should do nothing', t => {
  const vm = {}
  oClass(vm)
  t.pass()
})

test('should add class', t => {
  const el = document.createElement('div')
  el.setAttribute('o-class', '{my-class: showMyClass}')
  const vm = {
    $el: el,
    data: {
      showMyClass: true
    }
  }
  oClass(vm)
  t.true(vm.$el.classList.contains('my-class'))
})

test('should remove o-class attribute', t => {
  const el = document.createElement('div')
  el.setAttribute('o-class', '{my-class: showMyClass}')
  const vm = {
    $el: el,
    data: {
      showMyClass: true
    }
  }
  oClass(vm)
  t.false(vm.$el.hasAttribute('o-class'))
})
