import * as sinon from 'sinon'
import fireEvent from '../helpers/fireEvent'
import Instance from '../../src/core/Instance'

test('should add a keyup listener', () => {
  const el = document.createElement('div')
  el.setAttribute('o-on-keyup', 'onKeyUp')
  document.body.appendChild(el)
  const onKeyUp = sinon.spy()
  const Foo = {
    template: `<div o-on-keyup="onKeyUp"></div>`,
    onKeyUp
  }
  const vm: any = Instance(Foo, el)
  fireEvent(vm.$el.children[0], 'keyup')
  expect(onKeyUp.called).toBeTruthy()
  vm.$destroy()
})

test('should add click listener', () => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const onClick = sinon.spy()
  const Foo = {
    template: `<div o-on-click="onClick"></div>`,
    onClick
  }

  const vm: any = Instance(Foo, el)
  fireEvent(vm.$el.children[0], 'click')
  expect(onClick.called).toBeTruthy()
  vm.$destroy()
})

test('should add a click listener to child element', () => {
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
  const vm: any = Instance(Foo, el)
  fireEvent(vm.$el.children[0], 'click')
  fireEvent(vm.$el.children[0].children[0], 'click')
  expect(onClick.callCount).toBe(1)
  expect(onClick2.callCount).toBe(1)
  vm.$destroy()
})
