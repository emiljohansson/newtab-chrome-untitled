import { Subject } from '../../core/Subject'
import { date } from '../Terminal/cmd'
import { LitComponent, html } from '../../core/LitComponent'
import { Component } from '../../core/decorators'

const updateSubject: Subject<void> = new Subject()
let currentMin = -1
setInterval(() => {
  const now = date()
  if (now.getMinutes() !== currentMin) {
    currentMin = now.getMinutes()
    updateSubject.next()
  }
}, 1000)

@Component({
  data: {
    time: '00:00',
    timezone: ''
  }
})
class Time extends LitComponent {
  public mounted (): void {
    const update: () => void = (): void => {
      const date: string = new Date().toLocaleString('en-US', {
        timeZone: (this as any).timezone
      })
      const sections: string[] = date.slice(10).split(':')
      const hours: string = sections[0]
      const minutes: string = sections[1]
      // const seconds: string = sections[2].split(' ')[0]
      const meridiem: string = sections[2].split(' ')[1]

      ;(this as any).time = `${hours}:${minutes} ${meridiem}`
    }

    updateSubject.subscribe(update)
    update()
  }

  public render (): () => string {
    return html`<slot></slot><span>${'time'}</span>`
  }
}

export default Time
