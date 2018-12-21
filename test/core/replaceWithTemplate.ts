import replaceWithTemplate from '../../src/core/replaceWithTemplate'
import state from '../../src/core/state'

test('should replace all text nodes with data from `vm`', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const vm = {
    $el: el,
    template: `{{foo}}, {{bar}}`,
    data: {
      foo: 'Hello',
      bar: 'World'
    }
  }
  replaceWithTemplate(vm)
  state(vm)
  t.is(vm.$el.childNodes.length, 1)
  t.is(vm.$el.childNodes[0].textContent, 'Hello, World')
  document.body.removeChild(vm.$host)
})
