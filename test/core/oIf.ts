import * as sinon from 'sinon'
import install from '../../src/core/install'
import instanceFactory from '../../src/core/Instance'

test('should add and remove element', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show">World</span></article>`,
    data: {
      show: false
    }
  }
  const vm: any = instanceFactory(Foo, el)
  const rootEl: Element = vm.$el.firstChild as Element
  expect(rootEl.innerHTML).toBe(`Hello, <!--${vm.$id}.show-->`)
  vm.show = true
  expect(rootEl.innerHTML).toBe(`Hello, <!--${vm.$id}.show--><span>World</span>`)
  vm.show = false
  expect(rootEl.innerHTML).toBe(`Hello, <!--${vm.$id}.show-->`)
  vm.$destroy()
})

test('should add and remove apps', () => {
  const mounted: any = sinon.spy()
  const destroyed: any = sinon.spy()
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
  const vm: any = instanceFactory(Foo, el)
  const falseExpected = `Hello, <!--${vm.$id}.show-->`
  const trueExpected = `Hello, <!--${vm.$id}.show--><div>World</div>`
  expect(vm.$el.firstChild.innerHTML).toBe(falseExpected)
  vm.show = true
  expect(vm.$el.firstChild.innerHTML).toBe(trueExpected)
  vm.show = false
  expect(vm.$el.firstChild.innerHTML).toBe(falseExpected)
  vm.show = true
  expect(vm.$el.firstChild.innerHTML).toBe(trueExpected)
  expect(mounted.callCount).toBe(2)
  expect(destroyed.callCount).toBe(1)
  vm.$destroy()
})

test('should allow initial true value', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show">World</span></article>`,
    data: {
      show: true
    }
  }
  const vm: any = instanceFactory(Foo, el)
  const rootEl = vm.$el.firstChild
  expect(rootEl.innerHTML).toBe(`Hello, <!--${vm.$id}.show--><span>World</span>`)
  vm.show = false
  expect(rootEl.innerHTML).toBe(`Hello, <!--${vm.$id}.show-->`)
  vm.$destroy()
})

test('should add child app with initial true value', () => {
  const mounted: any = sinon.spy()
  const destroyed: any = sinon.spy()
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
  const vm: any = instanceFactory(Foo, el)
  const falseExpected = `Hello, <!--${vm.$id}.show-->`
  const trueExpected = `Hello, <!--${vm.$id}.show--><div>World</div>`
  expect(vm.$el.firstChild.innerHTML).toBe(trueExpected)
  vm.show = false
  expect(vm.$el.firstChild.innerHTML).toBe(falseExpected)
  vm.$destroy()
})
