import test from 'ava'
import sinon from 'sinon'
import fireEvent from '../helpers/fireEvent'
import Instance from 'core/Instance'

test('should add a keyup listener', t => {
  const el = document.createElement('div')
  el.setAttribute('o-on-keyup', 'onKeyUp')
  document.body.appendChild(el)
  const onKeyUp = sinon.spy()
  const Foo = {
    template: `<div o-on-keyup="onKeyUp"></div>`,
    onKeyUp
  }
  const vm = Instance(Foo, el)
  fireEvent(vm.$el.children[0], 'keyup')
  t.true(onKeyUp.called)
  vm.$destroy()
})

test('should add click listener', t => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const onClick = sinon.spy()
  const Foo = {
    template: `<div o-on-click="onClick"></div>`,
    onClick
  }

  const vm = Instance(Foo, el)
  fireEvent(vm.$el.children[0], 'click')
  t.true(onClick.called)
  vm.$destroy()
})

test('should add a click listener to child element', t => {
  const el = document.createElement('div')
  el.innerHTML = ``
  document.body.appendChild(el)
  const onClick = sinon.spy()
  const onClick2 = sinon.spy()
  const Foo = {
    template: `<div o-on-click="onClick($event)">
  <div o-on-click="onClick2($event)"></div>
</div>`,
    onClick,
    onClick2 (event) {
      onClick2()
      event.stopPropagation()
      event.preventDefault()
    }
  }
  const vm = Instance(Foo, el)
  fireEvent(vm.$el.children[0], 'click')
  fireEvent(vm.$el.children[0].children[0], 'click')
  t.is(onClick.callCount, 1)
  t.is(onClick2.callCount, 1)
  vm.$destroy()
})
