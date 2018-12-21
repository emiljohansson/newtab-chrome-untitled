import Instance from '../../src/core/Instance'

test('should toggle class', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-class="{my-class: showMyClass}"></div>`,
    data: {
      showMyClass: true
    }
  }
  const vm = Instance(Foo, el)
  const className = 'my-class'
  expect(vm.$el.children[0].classList.contains(className)).toBeTruthy()
  vm.showMyClass = !vm.showMyClass
  expect(vm.$el.children[0].classList.contains(className)).toBeFalsy()
  vm.showMyClass = !vm.showMyClass
  expect(vm.$el.children[0].classList.contains(className)).toBeTruthy()
  vm.$destroy()
})

test('should toggle child classes', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
    <div o-class="{my-class: showMyClass}"></div>
</article>`,
    data: {
      showMyClass: true
    }
  }
  const vm = Instance(Foo, el)
  const childEl = vm.$el.children[0].children[0]
  expect(childEl.classList.contains('my-class')).toBeTruthy()
  vm.showMyClass = !vm.showMyClass
  expect(childEl.classList.contains('my-class')).toBeFalsy()
  vm.showMyClass = !vm.showMyClass
  expect(childEl.classList.contains('my-class')).toBeTruthy()
  vm.$destroy()
})

test('should remove o-class attribute', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-class="{my-class: showMyClass}"></div>`,
    data: {
      showMyClass: true
    }
  }
  const vm = Instance(Foo, el)
  expect(vm.$el.children[0].hasAttribute('o-class')).toBeFalsy()
  vm.$destroy()
})
