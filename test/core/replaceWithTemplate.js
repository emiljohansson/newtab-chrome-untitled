import test from 'ava'
import replaceWithTemplate from 'core/replaceWithTemplate'
import state from 'core/state'

test('should replace all text nodes with data from `vm`', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const vm = {
    $el: el,
    template: `<div>{{foo}}, {{bar}}</div>`,
    data: {
      foo: 'Hello',
      bar: 'World'
    }
  }
  state(vm)
  replaceWithTemplate(vm)
  t.is(vm.$el.innerHTML, 'Hello, World')
  document.body.removeChild(vm.$el)
})
