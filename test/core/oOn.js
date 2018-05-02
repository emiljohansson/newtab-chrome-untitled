import test from 'ava'
import sinon from 'sinon'
import fireEvent from '../helpers/fireEvent'
import oOn from 'core/oOn'

test('should add a click listener', t => {
  const el = document.createElement('div')
  el.setAttribute('o-on-click', 'onClick')
  const onClick = sinon.spy()
  const vm = {
    $el: el,
    onClick
  }
  oOn(vm)
  fireEvent(el, 'click')
  t.true(onClick.called)
})

test('should remove attribute', t => {
  const el = document.createElement('div')
  el.setAttribute('o-on-click', 'onClick')
  const vm = {
    $el: el
  }
  oOn(vm)
  t.false(vm.$el.hasAttribute('o-on-click'))
})

test('should do nothing', t => {
  const vm = {}
  oOn(vm)
  t.pass()
})

test('should add a keyup listener', t => {
  const el = document.createElement('div')
  el.setAttribute('o-on-keyup', 'onKeyUp')
  const onKeyUp = sinon.spy()
  const vm = {
    $el: el,
    onKeyUp
  }
  oOn(vm)
  fireEvent(el, 'keyup')
  t.true(onKeyUp.called)
})

test('should add a click listener to child element', t => {
  const el = document.createElement('div')
  el.setAttribute('o-on-click', 'onClick')
  el.innerHTML = `<div o-on-click="onClick2($event)"></div>`
  const onClick = sinon.spy()
  const onClick2 = sinon.spy()
  const vm = {
    $el: el,
    onClick,
    onClick2(event) {
      onClick2()
      event.stopPropagation()
      event.preventDefault()
    }
  }
  oOn(vm)
  fireEvent(el, 'click')
  fireEvent(el.firstChild, 'click')
  t.is(onClick.callCount, 1)
  t.is(onClick2.callCount, 1)
})
