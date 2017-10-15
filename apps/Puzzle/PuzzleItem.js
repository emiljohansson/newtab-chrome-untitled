import jss from 'jss'

const { classes } = jss.createStyleSheet({
  puzzleItem: {
    border: '1px solid',
    cursor: 'pointer',
    float: 'left',
    height: '45px',
    width: '45px'
  },
  blankColumn: {
    backgroundColor: '#e3e3e3'
  }
}).attach()

const template = `<div
  class="${classes.puzzleItem}"
  o-on-click="onClick">{{value}}</div>`

const PuzzleItem = {
  template,
  data: {
    value: ''
  }
}

PuzzleItem.mounted = function () {
  if (this.value === '') {
    this.$el.classList.add(classes.blankColumn)
  }
}

PuzzleItem.onClick = function () {
  this.$emit('click', this.$el)
}

export default PuzzleItem
