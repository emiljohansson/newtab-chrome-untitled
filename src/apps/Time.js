import moment from 'moment-timezone'
import { Subject } from 'rxjs/Subject'
import { date } from 'apps/Terminal/cmd'

const updateSubject = new Subject()
let currentMin = -1
setInterval(() => {
  const now = date()
  if (now.getMinutes() !== currentMin) {
    currentMin = now.getMinutes()
    updateSubject.next()
  }
}, 1000)

const styles = {
  time: {}
}

const template = `
<article class="time">
  {{title}} {{time}}
</article>
`

const Time = {
  styles,
  template,
  data: {
    time: '00:00',
    title: ''
  }
}

Time.mounted = function () {
  const update = () => {
    this.time = `${moment().tz(this.timezone).format('h:mm A')}`
  }

  updateSubject.subscribe(update)
  update()
}

export default Time
