import jss from 'jss'
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

const { classes } = jss.createStyleSheet({
}).attach()

const template = `
<article class="time">
  <span class="time-title">{{title}}</span><span class="time-time">{{time}}</span>
</article>
`

const Time = {
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
