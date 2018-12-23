import * as sinon from 'sinon'
import { isFunction } from 'lodash'
import fireEvent from '../helpers/fireEvent'
import instanceFactory, { Instance } from '../../src/core/Instance'
import install from '../../src/core/install'
import watch from '../../src/core/watch'
import InstanceConstructor from '../../src/core/InstanceConstructor'

test('should create an vm instance', () => {
  const callback: any = sinon.spy()
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  el.setAttribute('foo', 'bar')
  const vm: any = instanceFactory({
    data: {
      value: 123
    },
    beforeUpdate: callback
  }, el)
  expect(vm.data.foo).toBe('bar')
  expect(vm.foo).toBe('bar')
  expect(vm.data.value).toBe(123)
  expect(vm.value).toBe(123)
  expect(isFunction(vm.$destroy)).toBeTruthy()

  vm.foo = 'bas'
  expect(callback.called).toBeTruthy()
})

test('should create an vm instance from a class', () => {
  const callback: any = sinon.spy()
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  el.setAttribute('foo', 'bar')

  class Component extends InstanceConstructor {
    public data: any = {
      value: 123
    }

    public mounted (): void {
      callback()
    }
  }
  const vm: any = instanceFactory(Component, el)
  expect(vm.data.foo).toBe('bar')
  expect(vm.foo).toBe('bar')
  expect(vm.data.value).toBe(123)
  expect(vm.value).toBe(123)
  expect(isFunction(vm.$destroy)).toBeTruthy()
  expect(callback.called).toBeTruthy()
})

test('should allow custom data', () => {
  const expected = 234
  const context = {
    value: expected
  }
  const App = {
    data: {
      value: 123
    }
  }
  const vm: any = instanceFactory(App, null, context)
  expect(vm.value).toBe(expected)
})

test('should create a unique vm instance', () => {
  const App = {
    data: {
      value: 123
    }
  }
  const vm1: any = instanceFactory(App, null)
  const vm2: any = instanceFactory(App, null)
  vm1.value = 234
  expect(vm2.value).toBe(123)
})

test('should not touch child elements when data changes', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `{{foo}}
  <span>Hello</span>
  {{fooworld}}`,
    data: {
      foo: 'bar',
      fooworld: 'World'
    }
  }
  const vm: any = instanceFactory(App, el)
  const childNodes = vm.$el.childNodes
  vm.foo = 'bas'
  expect(childNodes[0].textContent.trim()).toBe('bas')
  expect(childNodes[2].textContent.trim()).toBe('World')
  expect(vm.$el.childNodes[1]).toBe(childNodes[1])
  vm.$destroy()
})

test('should update each data separately in single text node', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `<template>{{foo}} {{bar}}, {{ foo }}</template>`,
    data: {
      foo: 'Hello',
      bar: 'World'
    }
  }
  const vm: any = instanceFactory(App, el)
  expect(vm.$el.childNodes[0].textContent).toBe('Hello World, Hello')
  vm.$destroy()
})

test('should only update view after $nextTick been triggered', () => {
  expect.assertions(2)
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `{{foo}}-{{bar}}`,
    data: {
      foo: 'not updated',
      bar: 1
    },
    triggerUpdate (this: any) {
      this.foo = 'updated'
      this.bar = 2
      expect(this.$el.childNodes[0].textContent).toBe('not updated-1')
      this.$nextTick(() => {
        expect(this.$el.childNodes[0].textContent).toBe('updated-2')
        this.$destroy()
      })
    }
  }
  const vm: any = instanceFactory(App, el)
  vm.triggerUpdate()
})

test('should replace empty values with an empty string', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `<div>{{foo}} {{bar}}</div>`,
    data: {
      foo: '',
      bar: 'World'
    }
  }
  const vm: any = instanceFactory(App, el)
  expect(vm.$el.children[0].innerHTML).toBe(' World')
  vm.$destroy()
})

test('should create sub apps', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `{{foo}}
<div is="Bar"></div>`,
    data: {
      foo: '',
      bar: 'World'
    }
  }
  const Bar = {
    template: `{{msg}}`,
    data: {
      msg: 'World'
    }
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  const barEl = vm.$el.children[0]
  expect(barEl.shadowRoot.childNodes[0].textContent).toBe('World')
  expect(vm.$children[0].$parent).toEqual(vm)
  vm.$destroy()
})

test('should create sub apps in for loop', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-for="data in bars" is="Bar"></div>`,
    data: {
      bars: [{ id: 1 }, { id: 2 }]
    }
  }
  const Bar = {
    template: `{{msg}}`,
    data: {
      msg: 'World'
    }
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.children.length).toBe(2)
  expect(vm.$children.length).toBe(2)
  expect(vm.$children[0].id).toBe(1)
  expect(vm.$children[1].id).toBe(2)
  vm.$destroy()
})

test('should add an item to the view when calling unshift/push on an array', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-for="data in list" is="Bar"></div>`,
    data: {
      list: [
        { index: 1 },
        { index: 2 }
      ]
    }
  }
  const Bar = {
    template: `{{index}}`,
    data: {
      index: -1
    }
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.children.length).toBe(2)
  vm.list.push({ index: 3 })
  expect(vm.$el.children.length).toBe(3)
  expect(vm.$el.children[2].shadowRoot.innerHTML).toBe('3')
  vm.list.unshift({ index: 4 })
  expect(vm.$el.children.length).toBe(4)
  expect(vm.$el.children[0].shadowRoot.innerHTML).toBe('4')
  vm.$destroy()
})

test('should destroy child apps', () => {
  const destroyed1 = sinon.spy()
  const destroyed2 = sinon.spy()
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  <div is="Bar"></div>
</article>`,
    data: {
      list: [{ value: 1 }, { value: 2 }]
    }
  }
  const Bar = {
    template: `<div>
    <div is="Baz"></div>
  </div>`,
    data: {
      index: 0
    },
    destroyed: destroyed1
  }
  const Baz = {
    template: `<div>{{index}}</div>`,
    data: {
      index: 1
    },
    destroyed: destroyed2
  }

  install('Bar', Bar)
  install('Baz', Baz)

  const vm: any = instanceFactory(Foo, el)
  vm.$destroy()
  sinon.assert.callOrder.apply(null, [
    destroyed2,
    destroyed1
  ])
})

test('should remove dom events', () => {
  const onClick = sinon.spy()
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article o-on-click="onClick"></article>`,
    data: {
      list: [{ value: 1 }, { value: 2 }]
    },
    onClick
  }

  const vm: any = instanceFactory(Foo, el)
  fireEvent(vm.$el.children[0], 'click')
  expect(onClick.callCount).toBe(1)
  vm.$destroy()
  fireEvent(vm.$el.children[0], 'click')
  expect(onClick.callCount).toBe(1)
})

test('should remove watchers', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>{{value}}</article>`,
    data: {
      value: 1
    }
  }

  const vm: any = instanceFactory(Foo, el)
  const subject = watch(vm, 'value')
  expect(subject.numberOfSubscriptions).toBe(1)
  vm.$destroy()
  expect(subject.numberOfSubscriptions).toBe(0)
})

test('should remove a app in the loop', () => {
  const destroyed = sinon.spy()
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-for="value in list" is="Bar"></div>`,
    data: {
      list: [{ value: 1 }, { value: 2 }]
    }
  }
  const Bar = {
    template: `{{value}}`,
    data: {
      value: 0
    },
    destroyed
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.children.length).toBe(2)
  expect(vm.$el.children[1].shadowRoot.innerHTML).toBe('2')
  vm.list.splice(1, 1)
  expect(vm.$el.children.length).toBe(1)
  expect(destroyed.called).toBeTruthy()
  vm.$destroy()
})

// test('should pass down props to child instance', () => {
//   const el: HTMLElement = document.createElement('div')
//   el.innerHTML = `<div is="Bar" o-props="childProps"></div>`
//   document.body.appendChild(el)
//   const onClick = sinon.spy()
//   const vm: any = {
//     $el: el,
//     childProps: ['foo']
//   }
//   const Bar = {
//     template: `<article>{{msg}}</article>`,
//     data: {}
//   }
//   install('Bar', Bar)
//   const vm: any = Instance(Foo, el)
//   t.deepEqual(vm.$host.children[0].data., )
//   vm.$destroy()
// })

test('should call parent method from child', () => {
  const el: HTMLElement = document.createElement('div')
  el.innerHTML = `<div is="Bar" o-emit-increment="onIncrement"></div>`
  document.body.appendChild(el)
  let sum = 0
  let args
  const Foo = {
    onIncrement (a: any, b: any, c: any) {
      sum++
      args = [a, b, c]
    }
  }
  const Bar = {
    template: `<article o-on-click="onClick">{{msg}}</article>`,
    data: {},
    onClick (this: Instance) {
      this.$emit('increment', 1, 2, 'foo')
    }
  }
  install('Bar', Bar)
  const vm: any = instanceFactory(Foo, el)
  fireEvent(vm.$host.children[0].shadowRoot.children[0], 'click')
  expect(sum).toBe(1)
  expect(args).toEqual([1, 2, 'foo'])
  vm.$destroy()
})

test('should append root class names to new shadow host', () => {
  const expected = 'foo bar'
  const el: HTMLElement = document.createElement('div')
  el.className = expected
  document.body.appendChild(el)
  const Foo = {
    template: `<div></div>`,
    $el: el
  }
  const vm: any = instanceFactory(Foo, el)
  expect(vm.$host.className).toBe(expected)
  vm.$destroy()
})

test('should create a app reference with oRef', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  let barVm
  const Foo = {
    template: `<article>
  <span is="Bar" o-ref="bar"></span>
</article>`,
    data: {}
  }
  const Bar = {
    template: `World`,
    data: {},
    mounted () {
      barVm = this
    }
  }
  install('Bar', Bar)
  const vm: any = instanceFactory(Foo, el)
  expect(vm.$refs.bar).toEqual(barVm)
  expect(barVm.$host.hasAttribute('o-ref')).toBeFalsy()

  vm.$destroy()
  expect(vm.$refs).toBeUndefined()
})

test('should store a DOM element containing oRef', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  <span o-ref="bar"></span>
</article>`,
    data: {}
  }
  const vm: any = instanceFactory(Foo, el)
  expect(vm.$refs.bar).toEqual(vm.$el.querySelector('span'))
  expect(vm.$refs.bar.hasAttribute('o-ref')).toBeFalsy()

  vm.$destroy()
  expect(vm.$refs).toBeUndefined()
})

test('should create an array for each reference with oRef in a oFor', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  <span is="Bar" o-for="barData in barsData" o-ref="bars"></span>
</article>`,
    data: {
      barsData: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
  }
  const Bar = {
    template: `<article>World</article>`,
    data: {},
    mounted () {
      //
    }
  }
  install('Bar', Bar)
  const vm: any = instanceFactory(Foo, el)
  expect(vm.$refs.bars.length).toBe(3)
  expect(vm.$refs.bars[0].id).toBe(1)
  expect(vm.$refs.bars[1].id).toBe(2)
  expect(vm.$refs.bars[2].id).toBe(3)

  vm.barsData.unshift({ id: 4 })
  expect(vm.$refs.bars[0].id).toBe(4)
  expect(vm.$refs.bars[1].id).toBe(1)

  vm.barsData.splice(0, 1)
  expect(vm.$refs.bars.length).toBe(3)
  expect(vm.$refs.bars[0].id).toBe(1)

  vm.$destroy()
})

test('moving around array values should update view', () => {
  const el: HTMLElement = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<span o-for="values in values">{{value}}</span>`,
    data: {
      values: [1, 2, 3, 4]
    }
  }
  const vm: any = instanceFactory(Foo, el)

  expect(vm.$el.children[0].innerHTML).toBe('1')
  expect(vm.$el.children[2].innerHTML).toBe('3')

  vm.values[2] = vm.values.splice(0, 1, vm.values[2])[0]

  expect(vm.$el.children[0].innerHTML).toBe('3')
  expect(vm.$el.children[2].innerHTML).toBe('1')

  vm.$destroy()
})

// test('moving around array apps should update view', () => {
//   const el: HTMLElement = document.createElement('div')
//   document.body.appendChild(el)
//   let barVm
//   const Foo = {
//     template: `<article>
//   <span is="Bar" o-for="context in values">{{value}}</span>
// </article>`,
//     data: {
//       values: [
//         {value: 1},
//         {value: 2},
//         {value: 3},
//         {value: 4}
//       ]
//     }
//   }
//   const Bar = {
//     template: `<article>{{value}}</article>`,
//     data: {
//       value: -1
//     },
//     mounted () {}
//   }
//   install('Bar', Bar)
//   const vm: any = Instance(Foo, el)

//   expect(vm.$host.children[0].innerHTML, '1')
//   expect(vm.$host.children[2].innerHTML, '3')

//   vm.values[2] = vm.values.splice(0, 1, vm.values[2])[0]

//   expect(vm.$host.children[0].innerHTML, '3')
//   expect(vm.$host.children[2].innerHTML, '1')

//   vm.$destroy()
// })
