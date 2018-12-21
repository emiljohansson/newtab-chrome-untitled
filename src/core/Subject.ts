import { forEach } from 'lodash'

export interface Subject {
  readonly numberOfSubscriptions: number
  complete: () => void
  next: (value?: any) => void
  subscribe: (callback: any) => any
}

export default (): Subject => {
  const subscriptions: any[] = []
  let completed: boolean = false

  const unsubscribe: any = (callback: any): any => (): void => {
    let index: number = subscriptions.length
    while (index--) {
      if (callback === subscriptions[index]) {
        subscriptions.splice(index, 1)
        return
      }
    }
  }

  const subject: Subject = {
    get numberOfSubscriptions (): number {
      return subscriptions.length
    },
    complete (): void {
      completed = true
      subscriptions.length = 0
    },
    next (value: any): void {
      if (completed) {
        return
      }
      forEach(subscriptions, (subscription: any) => {
        subscription(value)
      })
    },
    subscribe (callback: any): any {
      if (completed) {
        return
      }
      subscriptions.push(callback)
      return unsubscribe(callback)
    }
  }
  return subject
}
