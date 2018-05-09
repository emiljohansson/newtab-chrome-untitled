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

const PuzzleItem = {
  newStyle: true,
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
