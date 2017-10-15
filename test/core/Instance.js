import test from 'ava'
import sinon from 'sinon'
import { isFunction } from 'lodash'
import fireEvent from '../helpers/fireEvent'
import app from 'core/app'
import Instance from 'core/Instance'
import watch from 'core/watch'

test('should create an vm instance', t => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  el.setAttribute('foo', 'bar')
  const vm = Instance({
    data: {
      value: 123
    },
    beforeUpdate: callback
  }, el)
  t.is(vm.data.foo, 'bar')
  t.is(vm.foo, 'bar')
  t.is(vm.data.value, 123)
  t.is(vm.value, 123)
  t.true(isFunction(vm.$destroy))

  vm.foo = 'bas'
  t.true(callback.called)
})

test('should allow custom data', t => {
  const expected = 234
  const context = {
    value: expected
  }
  const App = {
    data: {
      value: 123
    }
  }
  const vm = Instance(App, null, context)
  t.is(vm.value, expected)
})

test('should create a unique vm instance', t => {
  const App = {
    data: {
      value: 123
    }
  }
  const vm1 = Instance(App)
  const vm2 = Instance(App)
  vm1.value = 234
  t.is(vm2.value, 123)
})

test('should not touch child elements when data changes', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `<div>
  {{foo}}
  <span>Hello</span>
  {{fooworld}}
</div>`,
    data: {
      foo: 'bar',
      fooworld: 'World'
    }
  }
  const vm = Instance(App, el)
  const childNodes = vm.$el.childNodes
  vm.foo = 'bas'
  t.is(childNodes[0].textContent.trim(), 'bas')
  t.is(childNodes[2].textContent.trim(), 'World')
  t.is(vm.$el.childNodes[1], childNodes[1])
  document.body.removeChild(vm.$el)
})

test('should update each data separately in single text node', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `<div>{{foo}} {{bar}}, {{ foo }}</div>`,
    data: {
      foo: 'Hello',
      bar: 'World'
    }
  }
  const vm = Instance(App, el)
  t.is(vm.$el.innerHTML, 'Hello World, Hello')
  document.body.removeChild(vm.$el)
})

test('should only update view after $nextTick been triggered', t => {
  t.plan(2)
  const el = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `<div>{{foo}}-{{bar}}</div>`,
    data: {
      foo: 'not updated',
      bar: 1
    },
    triggerUpdate () {
      this.foo = 'updated'
      this.bar = 2
      t.is(this.$el.innerHTML, 'not updated-1')
      this.$nextTick(() => {
        t.is(this.$el.innerHTML, 'updated-2')
        this.$destroy()
      })
    }
  }
  const vm = Instance(App, el)
  vm.triggerUpdate()
})

test('should replace empty values with an empty string', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const App = {
    template: `<div>{{foo}} {{bar}}</div>`,
    data: {
      foo: '',
      bar: 'World'
    }
  }
  const vm = Instance(App, el)
  t.is(vm.$el.innerHTML, ' World')
  document.body.removeChild(vm.$el)
})

test('should create sub apps', t => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div>
{{foo}}
<div is="Bar"></div>
</div>`,
    data: {
      foo: '',
      bar: 'World'
    }
  }
  const Bar = {
    template: `<article>{{msg}}</article>`,
    data: {
      msg: 'World'
    }
  }

  app('Bar', Bar)

  const vm = Instance(Foo, el)
  t.is(vm.$el.innerHTML.trim(), '<article>World</article>')
  t.deepEqual(vm.$children[0].$parent, vm)
  document.body.removeChild(vm.$el)
})

test('should create sub apps in for loop', t => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div>
<div o-for="data in bars" is="Bar"></div>
</div>`,
    data: {
      bars: [{id: 1}, {id: 2}]
    }
  }
  const Bar = {
    template: `<article>{{msg}}</article>`,
    data: {
      msg: 'World'
    }
  }

  app('Bar', Bar)

  const vm = Instance(Foo, el)
  t.is(vm.$el.children.length, 2)
  t.is(vm.$children.length, 2)
  t.is(vm.$children[0].id, 1)
  t.is(vm.$children[1].id, 2)
  document.body.removeChild(vm.$el)
})

test('should add an item to the view when calling unshift/push on an array', t => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div>
  <div o-for="data in list" is="Bar"></div>
</div>`,
    data: {
      list: [
        {index: 1},
        {index: 2}
      ]
    }
  }
  const Bar = {
    template: `<article>{{index}}</article>`,
    data: {
      index: -1
    }
  }

  app('Bar', Bar)

  const vm = Instance(Foo, el)
  t.is(vm.$el.children.length, 2)
  vm.list.push({index: 3})
  t.is(vm.$el.children.length, 3)
  t.is(vm.$el.children[2].innerHTML, '3')
  vm.list.unshift({index: 4})
  t.is(vm.$el.children.length, 4)
  t.is(vm.$el.children[0].innerHTML, '4')
  document.body.removeChild(vm.$el)
})

test('should destroy child apps', t => {
  const destroyed1 = sinon.spy()
  const destroyed2 = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  <div is="Bar"></div>
</article>`,
    data: {
      list: [{value: 1}, {value: 2}]
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

  app('Bar', Bar)
  app('Baz', Baz)

  const vm = Instance(Foo, el)
  vm.$destroy()
  sinon.assert.callOrder.apply(null, [
    destroyed2,
    destroyed1
  ])
  t.pass()
})

test('should remove dom events', t => {
  const onClick = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article o-on-click="onClick"></article>`,
    data: {
      list: [{value: 1}, {value: 2}]
    },
    onClick
  }

  const vm = Instance(Foo, el)
  fireEvent(vm.$el, 'click')
  t.is(onClick.callCount, 1)
  vm.$destroy()
  fireEvent(vm.$el, 'click')
  t.is(onClick.callCount, 1)
})

test('should remove watchers', t => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>{{value}}</article>`,
    data: {
      value: 1
    }
  }

  const vm = Instance(Foo, el)
  const subject = watch(vm, 'value')
  t.is(subject.observers.length, 1)
  vm.$destroy()
  t.is(subject.observers.length, 0)
})

test('should remove a app in the loop', t => {
  const destroyed = sinon.spy()
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  <div o-for="value in list" is="Bar"></div>
</article>`,
    data: {
      list: [{value: 1}, {value: 2}]
    }
  }
  const Bar = {
    template: `<div>{{value}}</div>`,
    data: {
      value: 0
    },
    destroyed
  }

  app('Bar', Bar)

  const vm = Instance(Foo, el)
  t.is(vm.$el.children.length, 2)
  t.is(vm.$el.children[1].innerHTML, '2')
  vm.list.splice(1, 1)
  t.is(vm.$el.children.length, 1)
  t.true(destroyed.called)
  document.body.removeChild(vm.$el)
})

test('should add click listener', t => {
  const el = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const onClick = sinon.spy()
  const Foo = {
    template: `<div o-on-click="onClick"></div>`,
    onClick
  }

  const vm = Instance(Foo, el)
  fireEvent(vm.$el, 'click')
  t.true(onClick.called)
  document.body.removeChild(vm.$el)
})

// test('should pass down props to child instance', t => {
//   const el = document.createElement('div')
//   el.innerHTML = `<div is="Bar" o-props="childProps"></div>`
//   document.body.appendChild(el)
//   const onClick = sinon.spy()
//   const vm = {
//     $el: el,
//     childProps: ['foo']
//   }
//   const Bar = {
//     template: `<article>{{msg}}</article>`,
//     data: {}
//   }
//   app('Bar', Bar)
//   const vm = Instance(Foo, el)
//   t.deepEqual(vm.$el.children[0].data., )
//   document.body.removeChild(vm.$el)
// })

test('should call parent method from child', t => {
  const el = document.createElement('div')
  el.innerHTML = `<div is="Bar" o-emit-increment="onIncrement"></div>`
  document.body.appendChild(el)
  const onIncrement = sinon.spy()
  let sum = 0
  let args
  const Foo = {
    onIncrement(a, b, c) {
      sum++
      args = [a, b, c]
    }
  }
  const Bar = {
    template: `<article o-on-click="onClick">{{msg}}</article>`,
    data: {},
    onClick() {
      this.$emit('increment', 1, 2, 'foo')
    }
  }
  app('Bar', Bar)
  const vm = Instance(Foo, el)
  fireEvent(vm.$el.firstChild, 'click')
  t.is(sum, 1)
  t.deepEqual(args, [1, 2, 'foo'])
  document.body.removeChild(vm.$el)
})

test('should toggle class', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<div o-class="{my-class: showMyClass}"></div>`,
    $el: el,
    data: {
      showMyClass: true
    }
  }
  const vm = Instance(Foo, el)
  t.true(vm.$el.classList.contains('my-class'))
  vm.showMyClass = !vm.showMyClass
  t.false(vm.$el.classList.contains('my-class'))
  vm.showMyClass = !vm.showMyClass
  t.true(vm.$el.classList.contains('my-class'))
  document.body.removeChild(vm.$el)
})

test('should toggle child classes', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
    <div o-class="{my-class: showMyClass}"></div>
</article>`,
    $el: el,
    data: {
      showMyClass: true
    }
  }
  const vm = Instance(Foo, el)
  const childEl = vm.$el.children[0]
  t.true(childEl.classList.contains('my-class'))
  vm.showMyClass = !vm.showMyClass
  t.false(childEl.classList.contains('my-class'))
  vm.showMyClass = !vm.showMyClass
  t.true(childEl.classList.contains('my-class'))
  document.body.removeChild(vm.$el)
})

test('should replace o-content with new html', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  <div is="Bar">
    <span>Sneaky</span>
  </div>
</article>`,
    $el: el,
    data: {}
  }
  const Bar = {
    template: `<article class="bar">
    {{o-content}}
</article>`,
    data: {}
  }
  app('Bar', Bar)
  const vm = Instance(Foo, el)
  const childEl = vm.$el.querySelector('.bar')
  t.is(childEl.children.length, 1)
  t.is(childEl.children[0].innerHTML, 'Sneaky')
  document.body.removeChild(vm.$el)
})

test('should replace o-content with app', t => {
  const mounted = sinon.spy()
  const destroyed = sinon.spy()
  const el = document.createElement('div')
  el.innerHTML = `<div is="Bar"></div>`
  document.body.appendChild(el)
  const Foo = {
    template: `<article>
  {{o-content}}
</article>`,
    data: {}
  }
  const Bar = {
    template: `<article class="bar">
  Bar
</article>`,
    data: {},
    mounted
  }
  app('Bar', Bar)
  const vm = Instance(Foo, el)
  t.is(mounted.callCount, 1)
  document.body.removeChild(vm.$el)
})

test('should add and remove element with oIf', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Foo = {
    template: `<article>Hello, <span o-if="show">World</span></article>`,
    data: {
      show: false
    }
  }
  const vm = Instance(Foo, el)
  t.is(vm.$el.innerHTML, `Hello, <!--${vm.$id}.show-->`)
  vm.show = true
  t.is(vm.$el.innerHTML, `Hello, <!--${vm.$id}.show--><span>World</span>`)
  vm.show = false
  t.is(vm.$el.innerHTML, `Hello, <!--${vm.$id}.show-->`)
  document.body.removeChild(vm.$el)
})

test('should add and remove apps with oIf', t => {
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
    template: `<article>World</article>`,
    data: {},
    mounted,
    destroyed
  }
  app('Bar', Bar)
  const vm = Instance(Foo, el)
  const falseExpected = `Hello, <!--${vm.$id}.show-->`
  const trueExpected = `Hello, <!--${vm.$id}.show--><article>World</article>`
  t.is(vm.$el.innerHTML, falseExpected)
  vm.show = true
  t.is(vm.$el.innerHTML, trueExpected)
  vm.show = false
  t.is(vm.$el.innerHTML, falseExpected)
  vm.show = true
  t.is(vm.$el.innerHTML, trueExpected)
  t.is(mounted.callCount, 2)
  t.is(destroyed.callCount, 1)
  document.body.removeChild(vm.$el)
})

test('should create a app reference with oRef', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  let barVm
  const Foo = {
    template: `<article>
  <span is="Bar" o-ref="bar"></span>
</article>`,
    data: {}
  }
  const Bar = {
    template: `<article>World</article>`,
    data: {},
    mounted () {
      barVm = this
    }
  }
  app('Bar', Bar)
  const vm = Instance(Foo, el)
  t.deepEqual(vm.$refs.bar, barVm)
  t.false(barVm.$el.hasAttribute('o-ref'))

  vm.$destroy()
  t.is(vm.$refs, undefined)
})

test('should create an array for each reference with oRef in a oFor', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  let barVm
  const Foo = {
    template: `<article>
  <span is="Bar" o-for="barData in barsData" o-ref="bars"></span>
</article>`,
    data: {
      barsData: [{id: 1}, {id: 2}, {id: 3}]
    }
  }
  const Bar = {
    template: `<article>World</article>`,
    data: {},
    mounted () {}
  }
  app('Bar', Bar)
  const vm = Instance(Foo, el)
  t.is(vm.$refs.bars.length, 3)
  t.is(vm.$refs.bars[0].id, 1)
  t.is(vm.$refs.bars[1].id, 2)
  t.is(vm.$refs.bars[2].id, 3)

  vm.barsData.unshift({id: 4})
  t.is(vm.$refs.bars[0].id, 4)
  t.is(vm.$refs.bars[1].id, 1)
  
  vm.barsData.splice(0, 1)
  t.is(vm.$refs.bars.length, 3)
  t.is(vm.$refs.bars[0].id, 1)
  
  vm.$destroy()
})

test('moving around array values should update view', t => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  let barVm
  const Foo = {
    template: `<article>
  <span o-for="values in values">{{value}}</span>
</article>`,
    data: {
      values: [1, 2, 3, 4]
    }
  }
  const vm = Instance(Foo, el)

  t.is(vm.$el.children[0].innerHTML, '1')
  t.is(vm.$el.children[2].innerHTML, '3')
  
  vm.values[2] = vm.values.splice(0, 1, vm.values[2])[0]
  
  t.is(vm.$el.children[0].innerHTML, '3')
  t.is(vm.$el.children[2].innerHTML, '1')

  vm.$destroy()
})

// test('moving around array apps should update view', t => {
//   const el = document.createElement('div')
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
//   app('Bar', Bar)
//   const vm = Instance(Foo, el)

//   t.is(vm.$el.children[0].innerHTML, '1')
//   t.is(vm.$el.children[2].innerHTML, '3')
  
//   vm.values[2] = vm.values.splice(0, 1, vm.values[2])[0]
  
//   t.is(vm.$el.children[0].innerHTML, '3')
//   t.is(vm.$el.children[2].innerHTML, '1')

  
//   vm.$destroy()
// })
