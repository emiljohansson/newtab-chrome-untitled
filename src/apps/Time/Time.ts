import Subject from '../../core/Subject'
import { date } from '../Terminal/cmd'

const updateSubject = Subject()
let currentMin = -1
setInterval(() => {
  const now = date()
  if (now.getMinutes() !== currentMin) {
    currentMin = now.getMinutes()
    updateSubject.next()
  }
}, 1000)

const template = `<slot></slot><span>{{time}}</span>`

const Time: any = {
  styles: {},
  template,
  data: {
    time: '00:00'
  }
}

Time.mounted = function () {
  const update = () => {
    this.time = `${(window as any).moment().tz(this.timezone).format('h:mm A')}`
  }

  updateSubject.subscribe(update)
  update()
}

export default Time
