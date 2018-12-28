import { forEach, keys } from 'lodash'
import attachStyleSheet from './styleSheet'
import { render } from './plain-html'
import { LitComponent } from './LitComponent'
import { Subject } from './Subject'
import watch from './watch'

const initRender: any = (vm: LitComponent): void => {
  if (!vm.render) {
    return
  }
  const oldEl: HTMLElement = vm.$el
  const parentEl: HTMLElement = (oldEl.parentElement || oldEl.parentNode) as HTMLElement
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
  // vm.$el.appendChild(document.createElement('template')).content.cloneNode(true)

  const dataKeys: string[] = keys(vm.data)
  forEach(dataKeys, (key: string) => {
    const update: any = (value: any): void => {
      render(template(vm), vm.$el)
    }
    const subject: Subject<any> = watch(vm, key)
    subject.subscribe(update)
    if (vm.data[key] != null) {
      update(vm.data[key])
    }
  })

  render(template(vm), vm.$el)
  if (parentEl) {
    parentEl.replaceChild(vm.$host!, oldEl)
    attachStyleSheet(vm.styles, vm.$el)
  }
}

export default initRender
