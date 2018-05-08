const styles = {
  '@global :host': {
    border: '1px solid',
    cursor: 'pointer',
    float: 'left',
    height: '45px',
    width: '45px'
  }
}

const template = classes => `<div o-on-click="onClick">{{value}}</div>`

const PuzzleItem = {
  styles,
  template,
  data: {
    value: ''
  }
}

PuzzleItem.mounted = function () {}

PuzzleItem.onClick = function () {
  this.$emit('click', this.$el)
}

export default PuzzleItem
