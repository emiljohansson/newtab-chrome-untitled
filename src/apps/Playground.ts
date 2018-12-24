import extendWindowApp from './WindowApp'
import directive from '../core/directive'
import InstanceConstructor from '../core/InstanceConstructor'
import { Component } from '../core/decorators'

directive('playground-foo-bar', el => {
  // tslint:disable-next-line:no-console
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

export const Playground: any = extendWindowApp('Playground', {
  debug: false,
  styles,
  template,
  data: {
    fooArray: ['foo', 'bar'],
    testVar: 1,
    testArr: [
      { text: 'Butter' },
      { text: 'Coffee' },
      { text: 'Carrots' }
    ],
    testArr2: [1, 2, 3],
    sum: 0,
    show: false
  }
})

Playground.beforeCreate = function () {
  (window as any).playground = this
}
// tslint:disable-next-line:no-empty
Playground.created = function () {}
// tslint:disable-next-line:no-empty
Playground.beforeMount = function () {}
// tslint:disable-next-line:no-empty
Playground.mounted = function () {}
// tslint:disable-next-line:no-empty
Playground.beforeDestroy = function () {}
// tslint:disable-next-line:no-empty
Playground.destroyed = function () {}
// tslint:disable-next-line:no-empty
Playground.beforeUpdate = function () {}
// tslint:disable-next-line:no-empty
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

@Component({
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
})
export class PlaygroundItem extends InstanceConstructor {
  public debug: false

  public onIncrementClick (): void {
    (this as any).counter++ // TODO remove any
    this.$emit('increment')
  }
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
