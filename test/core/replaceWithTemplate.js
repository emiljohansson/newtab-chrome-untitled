import test from 'ava'
import replaceWithTemplate from 'core/replaceWithTemplate'
import state from 'core/state'

test('should replace all text nodes with data from `vm`', t => {
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
  t.is(vm.$shadowRoot.childNodes.length, 1)
  t.is(vm.$shadowRoot.childNodes[0].textContent, 'Hello, World')
  document.body.removeChild(vm.$host)
})
