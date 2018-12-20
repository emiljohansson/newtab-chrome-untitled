import extendWindowApp from './WindowApp'
import directive from '../core/directive.ts'

directive('playground-foo-bar', el => {
  console.log(el)
})

const styles = {
  playground: {
    fontSize: '60%'
  }
}

const template = `
<article class="playground" playground-foo-bar>
  <div o-on-click="onClick">{{testVar}} {{ testVar }}</div>
  <div>Sum: {{sum}}</div>
  <div o-for="value in testArr2">{{value}}</div>
  <div o-for="item in testArr"
    is="PlaygroundItem"
    o-emit-increment="onIncrement">
    <b>Slot content</b>
  </div>
  <section o-for="value in fooArray">{{value}}</section>
  <button o-on-click="onToggleClicked">show/hide</button>
  <div o-if="show">Hello1</div>
  <div o-if="show">Hello2</div>
  <div o-if="show" is="PlaygroundIfItem"></div>
</article>
`

export const Playground = extendWindowApp('Playground', {
  debug: false,
  styles,
  template,
  data: {
    fooArray: ['foo', 'bar'],
    testVar: 1,
    testArr: [
      {text: 'Butter'},
      {text: 'Coffee'},
      {text: 'Carrots'}
    ],
    testArr2: [1, 2, 3],
    sum: 0,
    show: false
  }
})

Playground.beforeCreate = function () {
  window.playground = this
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
  debug: false,
  styles: {},
  template: `
<div class="playground-item">
  <slot></slot>
  {{text}} <button o-on-click="onIncrementClick()">{{counter}}</button>
</div>
`,
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
  styles: {},
  template: `
<div class="playground-ifitem">
  World
</div>
`,
  data: {}
}
