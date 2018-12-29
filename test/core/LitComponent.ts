import { LitComponent, html } from '../../src/core/LitComponent'
import install from '../../src/core/install'
import instanceFactory from '../../src/core/Instance'
import { Component } from '../../src/core/decorators'

test('should render empty template', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div>
<div is="Bar"></div>
</div>`
  }
  class Bar extends LitComponent {}

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.childNodes[0].innerHTML).toBe(`
<div></div>
`)
  vm.$destroy()
})

test('should render template', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  document.body.appendChild(el)
  const Foo = {
    template: `<div>
<div is="Bar" class="test"></div>
</div>`
  }
  class Bar extends LitComponent {
    public name: string = 'John'

    public render (): () => string {
      return html`Hello, ${'name'}!`
    }
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.childNodes[0].innerHTML).toBe(`
<div class="test">Hello, John!</div>
`)
  vm.$destroy()
})

test('should update html on data change', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  const Foo = {
    template: `<div>
<div is="Bar"></div>
</div>`
  }

  @Component({
    data: {
      value: 1
    }
  })
  class Bar extends LitComponent {
    public render (): () => string {
      return html`Value: ${'value'}`
    }
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.childNodes[0].innerHTML).toBe(`
<div>Value: 1</div>
`)

  vm.$children[0].value = 2
  expect(vm.$el.childNodes[0].innerHTML).toBe(`
<div>Value: 2</div>
`)
  vm.$destroy()
})

test('should append to a document fragment', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  const Foo = {
    template: `<div>
<article is="Bar"></article>
</div>`
  }

  const Bar = {
    template: `<span is="Baz"></span>`
  }

  @Component({
    data: {
      value: 1
    }
  })
  class Baz extends LitComponent {
    public render (): () => string {
      return html`Value: ${'value'}`
    }
  }

  install('Bar', Bar)
  install('Baz', Baz)

  const vm: any = instanceFactory(Foo, el)
  const bazNode: any = vm.$el.childNodes[0]
  expect(bazNode.innerHTML).toBe(`
<div><div>Value: 1</div></div>
`)
  vm.$destroy()
})

test('should render child elements', () => {
  const el: HTMLElement = document.createElement('div')
  el.setAttribute('is', 'Foo')
  const Foo = {
    template: `<div>
<div is="Bar"></div>
</div>`
  }

  @Component({
    data: {
      value: 1
    }
  })
  class Bar extends LitComponent {
    public render (): () => string {
      return html`<div>
        <span>${'value'}</span>
      </div>`
    }
  }

  install('Bar', Bar)

  const vm: any = instanceFactory(Foo, el)
  expect(vm.$el.childNodes[0].innerHTML).toBe(`
<div><div><span>        1      </span></div></div>
`)

  vm.$children[0].value = 2
  expect(vm.$el.childNodes[0].innerHTML).toBe(`
<div><div><span>        2      </span></div></div>
`)
  vm.$destroy()
})
