import { Subject } from '../core/Subject'

export default class Store<T> {
  private localState: T
  private subject: Subject<T> = new Subject()

  protected get state (): T {
    return this.localState
  }

  constructor (state: T) {
    this.localState = state
  }

  public subscribe (callback: (state: T) => void): void {
    this.subject.subscribe(callback)
  }

  protected mutate (handler: (state: T) => T): void {
    const newState: T = handler(this.localState)
    this.localState = newState
    this.subject.next(this.localState)
  }
}
