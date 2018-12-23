import { Instance } from '../../core/Instance'
import InstanceConstructor from '../../core/InstanceConstructor'
import { Component } from '../../core/decorators'

@Component({
  template: `<div class="value" o-on-click="onClick">{{value}}</div>`
})
class PuzzleItem extends InstanceConstructor {
  public styles: any = {
    ':host': {
      border: '1px solid',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      float: 'left',
      height: '45px',
      width: '45px'
    },
    value: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    }
  }

  public data: any = {
    value: ''
  }

  public mounted (): void {
    // tslint:disable-next-line:no-console
    console.log('PuzzleItem mounted')
  }

  public onClick (this: Instance) {
    this.$emit('click', this.$host)
  }
}

export default PuzzleItem
