import jss from 'jss'
import extendWindowApp from 'apps/WindowApp'

const { classes } = jss.createStyleSheet({
  app: {
    '& .time': {
      display: 'flex',
      color: 'white'
    },
    '& .time-title': {
      extend: 'column'
    },
    '& .time-time': {
      extend: 'column',
      textAlign: 'right'
    }
  },
  column: {
    flex: 1
  }
}).attach()

const template = `
<article class="${classes.app}">
  <div is="Time" title="Sweden" timezone="Europe/Stockholm"></div>
  <div is="Time" title="Shanghai" timezone="Asia/Shanghai"></div>
  <div is="Time" title="Los Angeles" timezone="America/Los_Angeles"></div>
</article>
`

const TimeApp = extendWindowApp('TimeApp', {
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
