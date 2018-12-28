import InstanceConstructor from '../../core/InstanceConstructor'
import { Component } from '../../core/decorators'

@Component({
  template: `<div class="value" o-on-click="onClick">{{value}}</div>`,
  styles: {
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
  },
  data: {
    value: ''
  }
})
class PuzzleItem extends InstanceConstructor {
  public mounted (): void {
    // // tslint:disable-next-line:no-console
    // console.log('PuzzleItem mounted')
  }

  public onClick (): void {
    this.$emit('click', this.$host)
  }
}

export default PuzzleItem
