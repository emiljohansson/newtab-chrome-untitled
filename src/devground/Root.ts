import { Component } from '../core/decorators'
import InstanceConstructor from '../core/InstanceConstructor'

@Component({
  template: `<div>
  <div is="Playground"></div>
</div>`
})
export default class extends InstanceConstructor {
  public mounted (): void {
    // tslint:disable-next-line:no-console
    console.log('mounted root')
  }
}
