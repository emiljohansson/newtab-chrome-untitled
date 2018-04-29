const styles = {
  '@global :host': {
    border: '1px solid',
    cursor: 'pointer',
    float: 'left',
    height: '45px',
    width: '45px'
  }
}

// {{value}}
const template = classes => `
<template>
  <div o-on-click="onClick">{{value}}</div>
</template>
`

const PuzzleItem = {
  debug: true,
  useShadow: true,
  styles,
  template,
  data: {
    value: ''
  }
}

PuzzleItem.mounted = function () {
  // if (this.value === '') {
  //   this.$el.classList.add(this.styleSheet.classes.blankColumn)
  // }
}

PuzzleItem.onClick = function () {
  this.$emit('click', this.$el)
}

export default PuzzleItem
