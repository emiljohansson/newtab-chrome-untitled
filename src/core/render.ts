import attachStyleSheet from './styleSheet'
import { render } from './plain-html'
import { LitComponent } from './LitComponent'

const initRender: any = (vm: LitComponent): void => {
  const oldEl: HTMLElement = vm.$el
  const parentEl: Node = (oldEl.parentElement || oldEl.parentNode) as Node
  const shadowContainer: HTMLElement = document.createElement('div')
  shadowContainer.attachShadow({
    mode: 'open'
  })
  const template: (props: any) => string = vm.render()

  ;(vm as any).$host = shadowContainer
  ;(vm as any).$el = shadowContainer.shadowRoot

  if (vm.data.class) {
    vm.$host!.className = vm.data.class
  }

  vm.$host!.innerHTML = oldEl.innerHTML

  render(template(vm), vm.$el)
  parentEl.replaceChild(vm.$host!, oldEl)
  attachStyleSheet(vm.styles, vm.$el)
}

export default initRender
