import moment from 'moment-timezone'
import { Subject } from 'rxjs/Subject'

const updateSubject = new Subject()
let currentMin = -1
setInterval(() => {
  const date = new Date()
  if (date.getMinutes() !== currentMin) {
    currentMin = date.getMinutes()
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
