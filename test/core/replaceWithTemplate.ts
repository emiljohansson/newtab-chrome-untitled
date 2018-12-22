import replaceWithTemplate from '../../src/core/replaceWithTemplate'
import state from '../../src/core/state'

test('should replace all text nodes with data from `vm`', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const vm: any = {
    $el: el,
    $data: {},
    template: `{{foo}}, {{bar}}`,
    data: {
      foo: 'Hello',
      bar: 'World'
    }
  }
  replaceWithTemplate(vm)
  state(vm)
  expect(vm.$el.childNodes.length).toBe(1)
  expect(vm.$el.childNodes[0].textContent).toBe('Hello, World')
  document.body.removeChild(vm.$host)
})
