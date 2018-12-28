import { html } from './plain-html'
import { Component } from './decorators'
import InstanceConstructor from './InstanceConstructor'

export { html }

@Component()
export class LitComponent extends InstanceConstructor {
  public render (): () => string {
    return html``
  }
}
