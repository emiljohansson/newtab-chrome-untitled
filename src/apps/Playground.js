import extendWindowApp from 'apps/WindowApp'
import directive from 'core/directive'

directive('playground-foo-bar', el => {
  console.log(el)
})

const styles = {
  playground: {
    fontSize: '60%'
  }
}

const template = classes => `
<template>
  <article class="${classes.playground}" playground-foo-bar>
    <div o-on-click="onClick">{{testVar}} {{ testVar }}</div>
    <div>Sum: {{sum}}</div>
    <div o-for="item in testArr"
      is="PlaygroundItem"
      o-emit-increment="onIncrement"></div>
    <button o-on-click="onToggleClicked">show/hide</button>
    <div o-if="show">Hello</div>
    <div o-if="show" is="PlaygroundIfItem"></div>
  </article>
</template>
`

export const Playground = extendWindowApp('Playground', {
  useShadow: true,
  styles,
  template,
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
  debug: false,
  styles: {},
  template: classes => `
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
  useShadow: true,
  styles: {},
  template: classes => `
<template>
  <div class="playground-ifitem">
    World
  </div>
</template>`,
  data: {}
}
