import { Instance } from '../../core/Instance'

const styles = {
  ':host': {
    border: '1px solid',
    cursor: 'pointer',
    float: 'left',
    height: '45px',
    width: '45px'
  }
}

const template = `<div o-on-click="onClick">{{value}}</div>`

const PuzzleItem: any = {
  styles,
  template,
  data: {
    value: ''
  }
}

// tslint:disable-next-line:no-empty
PuzzleItem.mounted = function () {}

PuzzleItem.onClick = function (this: Instance) {
  this.$emit('click', this.$host)
}

export default PuzzleItem
