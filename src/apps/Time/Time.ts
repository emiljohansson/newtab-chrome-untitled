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
    const update: any = (): void => {
      (this as any).time = `${(window as any)
        .moment()
        .tz((this as any)
        .timezone)
        .format('h:mm A')}`
    }

    updateSubject.subscribe(update)
    update()
  }

  public render (): () => string {
    return html`<slot></slot><span>${'time'}</span>`
  }
}

export default Time
