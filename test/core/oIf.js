import test from 'ava'
import sinon from 'sinon'
import Instance from 'core/Instance'
import install from 'core/install'

test('should add and remove element', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show">World</span></article>`,
    data: {
      show: false
    }
  }
  const vm = Instance(Foo, el)
  const rootEl = vm.$shadowRoot.firstChild
  t.is(rootEl.innerHTML, `Hello, <!--${vm.$id}.show-->`)
  vm.show = true
  t.is(rootEl.innerHTML, `Hello, <!--${vm.$id}.show--><span>World</span>`)
  vm.show = false
  t.is(rootEl.innerHTML, `Hello, <!--${vm.$id}.show-->`)
  vm.$destroy()
})

test('should add and remove apps', t => {
  const mounted = sinon.spy()
  const destroyed = sinon.spy()
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show" is="Bar"></span></article>`,
    data: {
      show: false
    }
  }
  const Bar = {
    template: `World`,
    data: {},
    mounted,
    destroyed
  }
  install('Bar', Bar)
  const vm = Instance(Foo, el)
  const falseExpected = `Hello, <!--${vm.$id}.show-->`
  const trueExpected = `Hello, <!--${vm.$id}.show--><div>World</div>`
  t.is(vm.$shadowRoot.firstChild.innerHTML, falseExpected)
  vm.show = true
  t.is(vm.$shadowRoot.firstChild.innerHTML, trueExpected)
  vm.show = false
  t.is(vm.$shadowRoot.firstChild.innerHTML, falseExpected)
  vm.show = true
  t.is(vm.$shadowRoot.firstChild.innerHTML, trueExpected)
  t.is(mounted.callCount, 2)
  t.is(destroyed.callCount, 1)
  vm.$destroy()
})

test('should allow initial true value', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show">World</span></article>`,
    data: {
      show: true
    }
  }
  const vm = Instance(Foo, el)
  const rootEl = vm.$shadowRoot.firstChild
  t.is(rootEl.innerHTML, `Hello, <!--${vm.$id}.show--><span>World</span>`)
  vm.show = false
  t.is(rootEl.innerHTML, `Hello, <!--${vm.$id}.show-->`)
  vm.$destroy()
})

test('should add child app with initial true value', t => {
  const mounted = sinon.spy()
  const destroyed = sinon.spy()
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show" is="Bar"></span></article>`,
    data: {
      show: true
    }
  }
  const Bar = {
    template: `World`,
    data: {},
    mounted,
    destroyed
  }
  install('Bar', Bar)
  const vm = Instance(Foo, el)
  const falseExpected = `Hello, <!--${vm.$id}.show-->`
  const trueExpected = `Hello, <!--${vm.$id}.show--><div>World</div>`
  t.is(vm.$shadowRoot.firstChild.innerHTML, trueExpected)
  vm.show = false
  t.is(vm.$shadowRoot.firstChild.innerHTML, falseExpected)
  vm.$destroy()
})
