import extendWindowApp from '../WindowApp'

const styles = {
  time: {
    display: 'flex',
    color: 'white'
  },
  title: {
    flex: 1
  }
}

const template = `
<div is="Time" class="time" timezone="Europe/Stockholm">
  <span class="title">Sweden</span>
</div>
<div is="Time" class="time" timezone="Asia/Shanghai">
  <span class="title">Shanghai</span>
</div>
<div is="Time" class="time"  timezone="America/Los_Angeles">
  <span class="title">Los Angeles</span>
</div>
`

const TimeApp = extendWindowApp('TimeApp', {
  styles,
  template,
  data: {},
  windowSettings: {
    background: '#323232'
    // titleBarStyle: 'hidden'
  }
})

TimeApp.created = function () {
  // console.log('created', this.windowSettings)
}

TimeApp.mounted = function () {
  // console.log('mount', this.windowSettings)
}

export default TimeApp
