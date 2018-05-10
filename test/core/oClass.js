import test from 'ava'
import Instance from 'core/Instance'

test('should toggle class', t => {
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
  t.true(vm.$shadowRoot.children[0].classList.contains(className))
  vm.showMyClass = !vm.showMyClass
  t.false(vm.$shadowRoot.children[0].classList.contains(className))
  vm.showMyClass = !vm.showMyClass
  t.true(vm.$shadowRoot.children[0].classList.contains(className))
  vm.$destroy()
})

test('should toggle child classes', t => {
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
  const childEl = vm.$shadowRoot.children[0].children[0]
  t.true(childEl.classList.contains('my-class'))
  vm.showMyClass = !vm.showMyClass
  t.false(childEl.classList.contains('my-class'))
  vm.showMyClass = !vm.showMyClass
  t.true(childEl.classList.contains('my-class'))
  vm.$destroy()
})

test('should remove o-class attribute', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-class="{my-class: showMyClass}"></div>`,
    data: {
      showMyClass: true
    }
  }
  const vm = Instance(Foo, el)
  t.false(vm.$shadowRoot.children[0].hasAttribute('o-class'))
  vm.$destroy()
})
