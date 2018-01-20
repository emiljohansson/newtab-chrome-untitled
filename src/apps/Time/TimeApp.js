import extendWindowApp from 'apps/WindowApp'

const styles = {}

const template = `
<article class="time-app">
  <div is="Time" title="Sweden" timezone="Europe/Stockholm"></div>
  <div is="Time" title="Shanghai" timezone="Asia/Shanghai"></div>
  <div is="Time" title="Los Angeles" timezone="America/Los_Angeles"></div>
</article>
`

const TimeApp = extendWindowApp('TimeApp', {
  styles,
  template,
  data: {}
})

TimeApp.mounted = function () {}

export default TimeApp
