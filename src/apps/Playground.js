import jss from 'jss'
import WindowApp from 'apps/WindowApp'

const { classes } = jss.createStyleSheet({
  playground: {
    fontSize: '60%'
  }
}).attach()

export const Playground = Object.assign({}, WindowApp, {
  template: `
<article class="${classes.playground}">
  <div o-on-click="onClick">{{testVar}} {{ testVar }}</div>
  <div>Sum: {{sum}}</div>
  <div o-for="item in testArr"
    is="PlaygroundItem"
    o-emit-increment="onIncrement"></div>
  <button o-on-click="onToggleClicked">show/hide</button>
  <div o-if="show">Hello</div>
  <div o-if="show" is="PlaygroundIfItem"></div>
</article>`,
  data: {
    testVar: 1,
    testArr: [
      {text: 'Butter'},
      {text: 'Coffee'},
      {text: 'Carrots'}
    ],
    sum: 0,
    show: false
  }
})

Playground.beforeCreate = function () {
  window.Playground = this
}
Playground.created = function () {}
Playground.beforeMount = function () {}
Playground.mounted = function () {}
Playground.beforeDestroy = function () {}
Playground.destroyed = function () {}
Playground.beforeUpdate = function () {}
Playground.updated = function () {}

Playground.onClick = function () {
  this.testVar++
  this.sum++
}

Playground.onToggleClicked = function () {
  this.show = !this.show
}

Playground.onIncrement = function () {
  this.sum++
}

export const PlaygroundItem = {
  template: `
<div class="playground-item">
  {{text}} <button o-on-click="onIncrementClick()">{{counter}}</button>
</div>`,
  data: {
    text: '',
    counter: 0
  }
}

PlaygroundItem.onIncrementClick = function () {
  this.counter++
  this.$emit('increment')
}

export const PlaygroundIfItem = {
  template: `
<div class="playground-ifitem">
  World
</div>`,
  data: {}
}
