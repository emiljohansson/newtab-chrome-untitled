import { Component } from '../core/decorators'
import { LitComponent, html } from '../core/LitComponent'

@Component({
  styles: {
    ':host': {
    }
  },
  data: {
    a: 'abc',
    b: 123
  }
})
export default class extends LitComponent {
  public a: string = 'aaa'
  public b: number = 111
  private i: number = 0

  public mounted (): void {
    // tslint:disable-next-line:no-console
    console.log('simple text mounted')

    // setInterval(this.update, 4000)
  }

  public update (): void {
    const strings: string[] = ['aaa', 'bbb']
    const numbers: number[] = [111, 222]
    this.i++
    const i: number = this.i
    this.a = strings[i % 2]
    this.b = numbers[i % 2]
  }

  public render (): () => string {
    // return html`<div>Hello</div>`
    return html`<div o-on-click="update">
      aa: ${'a'} - bb: ${'b'}!
    </div>`
  }
}
