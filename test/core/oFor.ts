import instanceFactory from '../../src/core/Instance'
import install from '../../src/core/install'

test('should create an element for each item in the list', () => {
  const el: HTMLElement = document.createElement('article')
  document.body.appendChild(el)
  const array: string[] = ['foo', 'bar']
  const Foo: any = {
    template: `<section o-for="value in list">{{value}}</section>`,
    data: {
      list: array
    }
  }
  const vm: any = instanceFactory(Foo, el)
  const rootEl: HTMLElement = vm.$el
  expect(rootEl.children.length).toBe(2)
  const firstChild = rootEl.children[0]
  const secondChild = rootEl.children[1]
  expect(firstChild.innerHTML).toBe(array[0])
  expect(secondChild.innerHTML).toBe(array[1])
  vm.$destroy()
})

test('should update view when item in list changes', () => {
  const el: HTMLElement = document.createElement('article')
  document.body.appendChild(el)
  const array: string[] = ['foo', 'bar']
  const Foo: any = {
    template: `<section o-for="value in list">{{value}}</section>`,
    data: {
      list: array
    }
  }
  const vm: any = instanceFactory(Foo, el)
  const rootEl: HTMLElement = vm.$el
  expect(rootEl.children.length).toBe(2)
  vm.list[0] = 'Hello'
  vm.list[1] = 'World'
  const firstChild = rootEl.children[0]
  const secondChild = rootEl.children[1]
  expect(firstChild.innerHTML).toBe('Hello')
  expect(secondChild.innerHTML).toBe('World')
  vm.$destroy()
})

test('should only replace brackets with matching objects', () => {
  const el: HTMLElement = document.createElement('article')
  document.body.appendChild(el)
  const array: string[] = ['foo', 'bar']
  const Foo: any = {
    template: `<section o-for="value in list">{{bad}}</section>`,
    data: {
      list: array
    }
  }
  const vm: any = instanceFactory(Foo, el)
  const rootEl: HTMLElement = vm.$el
  expect(rootEl.children.length).toBe(2)
  const firstChild = rootEl.children[0]
  const secondChild = rootEl.children[1]
  expect(firstChild.innerHTML).toBe('{{bad}}')
  expect(secondChild.innerHTML).toBe('{{bad}}')
  vm.$destroy()
})

test('should iterate nested array', () => {
  const el: HTMLElement = document.createElement('article')
  document.body.appendChild(el)
  const array: any[] = [
    [0, 1],
    [2, 3]
  ]
  const Foo: any = {
    template: `<div>
  <div o-for="row in list">
    <div o-for="column in row">{{column}}</div>
  </div>
</div>`,
    data: {
      list: array
    }
  }
  const vm: any = instanceFactory(Foo, el)
  const rootEl: HTMLElement = vm.$el.firstChild
  expect(rootEl.children.length).toBe(2)
  expect(rootEl.innerHTML).toBe(`
  <div>
    <div>0</div><div>1</div>
  </div><div>
    <div>2</div><div>3</div>
  </div>
`)
  vm.$destroy()
})

test('should pass context to nested instance', () => {
  const el: HTMLElement = document.createElement('article')
  document.body.appendChild(el)
  const array: any[] = [
    [{ value: 0 }, { value: 1 }],
    [{ value: 2 }, { value: 3 }]
  ]
  const Foo: any = {
    template: `<div>
  <div o-for="row in list">
    <div is="Bar" o-for="context in row">{{column}}</div>
    <div>sibling</div>
  </div>
</div>`,
    data: {
      list: array
    }
  }
  const Bar: any = {
    template: `<div>{{value}}</div>`,
    data: {
      value: 0
    }
  }
  install('Bar', Bar)
  const vm: any = instanceFactory(Foo, el)
  const rootEl: HTMLElement = vm.$el.firstChild
  expect(rootEl.children.length).toBe(2)
  expect(rootEl.innerHTML).toBe(`
  <div>
    <div><div>0</div></div><div><div>1</div></div>
    <div>sibling</div>
  </div><div>
    <div><div>2</div></div><div><div>3</div></div>
    <div>sibling</div>
  </div>
`)
  vm.$destroy()
})
