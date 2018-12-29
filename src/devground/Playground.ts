import { Component } from '../core/decorators'
import InstanceConstructor from '../core/InstanceConstructor'

@Component({
  template: `<div>
  <div is="SimpleText"></div>
  <div is="ElementTexts"></div>
</div>`,
  styles: {
    ':host': {
    }
  },
  data: {
  }
})
export default class extends InstanceConstructor {
  public mounted (): void {
    // tslint:disable-next-line:no-console
    console.log('playground mounted')

    // setInterval(this.update, 4000)
  }
}
