import { forEach } from 'lodash'

export default () => {
  const subscriptions = []
  let completed = false

  const subject = {
    get numberOfSubscriptions () {
      return subscriptions.length
    },
    complete () {
      completed = true
      subscriptions.length = 0
    },
    next (value) {
      if (completed) {
        return
      }
      forEach(subscriptions, subscription => {
        subscription(value)
      })
    },
    subscribe (callback) {
      if (completed) {
        return
      }
      subscriptions.push(callback)
    }
  }
  return subject
}
