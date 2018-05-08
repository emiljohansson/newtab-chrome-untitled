import test from 'ava'
import Instance from 'core/Instance'

test('should create an element for each item in the list', t => {
  const el = document.createElement('article')
  document.body.appendChild(el)
  const array = ['foo', 'bar']
  const Foo = {
    template: `<section o-for="value in list">{{value}}</section>`,
    data: {
      list: array
    }
  }
  const vm = Instance(Foo, el)
  const rootEl = vm.$el.shadowRoot
  t.is(rootEl.children.length, 3)
  const firstChild = rootEl.children[0]
  const secondChild = rootEl.children[1]
  t.is(firstChild.innerHTML, array[0])
  t.is(secondChild.innerHTML, array[1])
  vm.$destroy()
})

test('should update view when item in list changes', t => {
  const el = document.createElement('article')
  document.body.appendChild(el)
  const array = ['foo', 'bar']
  const Foo = {
    template: `<section o-for="value in list">{{value}}</section>`,
    data: {
      list: array
    }
  }
  const vm = Instance(Foo, el)
  const rootEl = vm.$el.shadowRoot
  t.is(rootEl.children.length, 3)
  vm.list[0] = 'Hello'
  vm.list[1] = 'World'
  const firstChild = rootEl.children[0]
  const secondChild = rootEl.children[1]
  t.is(firstChild.innerHTML, 'Hello')
  t.is(secondChild.innerHTML, 'World')
  vm.$destroy()
})
