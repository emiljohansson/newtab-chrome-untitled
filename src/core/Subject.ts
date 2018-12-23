import { forEach } from 'lodash'

export class Subject<T> {
  private subscriptions: any[] = []
  private completed: boolean = false

  private unsubscribe: any = (callback: any): any => (): void => {
    let index: number = this.subscriptions.length
    while (index--) {
      if (callback === this.subscriptions[index]) {
        this.subscriptions.splice(index, 1)
        return
      }
    }
  }

  public get numberOfSubscriptions (): number {
    return this.subscriptions.length
  }

  public complete (): void {
    this.completed = true
    this.subscriptions.length = 0
  }

  public next (value?: T): void {
    if (this.completed) {
      return
    }
    forEach(this.subscriptions, (subscription: any) => {
      subscription(value)
    })
  }

  public subscribe (callback: any): any {
    if (this.completed) {
      return
    }
    this.subscriptions.push(callback)
    return this.unsubscribe(callback)
  }
}
