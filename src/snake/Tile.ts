import InstanceConstructor from '../core/InstanceConstructor'
import { Component } from '../core/decorators'

@Component({
  template: `<div
  class="Tile"
  o-class="{
    active: isActive
  }">{{value}}</div>`,
  styles: {
    ':host': {
      border: '1px solid',
      display: 'inline-block',
      height: '18px',
      width: '18px'
    },
    Tile: {
      height: '100%',
      width: '100%'
    },
    active: {
      backgroundColor: 'red'
    }
  },
  data: {
    isActive: false,
    value: 0
  }
})
export default class extends InstanceConstructor {
  public mounted (): void {
    // tslint:disable-next-line:no-console
    console.log('Tile mounted', (this as any).value)
  }

  public update (): void {
    const self: any = (this as any)
    self.isActive = self.value === 1
    // tslint:disable-next-line:no-console
    console.log('update', self.isActive)
  }
}
