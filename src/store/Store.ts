import { Subject } from '../core/Subject'

export default class Store<T> {
  private state: any
  private subject: Subject<T> = new Subject()

  constructor (state: T) {
    this.state = state
  }

  public subscribe (callback: (state: T) => void): void {
    this.subject.subscribe(callback)
  }

  protected mutate (handler: (state: T) => T): void {
    const newState: T = handler(this.state)
    this.state = newState
    this.subject.next(this.state)
  }
}
