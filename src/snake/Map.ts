import { isFunction } from 'lodash'
import InstanceConstructor from '../core/InstanceConstructor'
import { Component } from '../core/decorators'
import * as keyboardHandler from 'keyboard-handler'

@Component({
  template: `<div o-on-click="onClick">
  <div class="row" o-for="row in tiles">
    <div is="Tile"
      o-for="context in row"></div>
  </div>
</div>`,
  styles: {
    ':host': {
    },
    row: {
      lineHeight: 0,
      margin: 0,
      padding: 0
    }
  },
  data: {
    tiles: null
  }
})
export default class extends InstanceConstructor {
  public beforeCreate (): void {
    this.data.tiles = [
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ].map((row: number[]) => {
      return row.map((value: number) => ({
        value
      }))
    })
  }

  public mounted (): void {
    // tslint:disable-next-line:no-console
    console.log('Map mounted')
    keyboardHandler.keyIsDown(keyboardHandler.codes.right, () => {
      // tslint:disable-next-line:no-console
      console.log('right')
      this.moveRight()
      this.update()
    })
    this.update()
  }

  private update (): void {
    // tslint:disable-next-line:no-console
    console.log('update map')
    const components: any[] = (this as any).$children
    components.forEach((component: any) => {
      if (isFunction(component.update)) {
        component.update()
      }
    })
  }

  private moveRight (): void {
    const tiles: any[] = (this as any).tiles
    tiles[0][1].value = 1
  }

  public onClick (): void {
    // tslint:disable-next-line:no-console
    console.log('click')
  }
}
