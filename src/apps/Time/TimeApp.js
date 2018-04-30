import extendWindowApp from 'apps/WindowApp'

const styles = {
  app: {
    '& .time-time': {
      extend: 'column',
      textAlign: 'right'
    }
  },
  time: {
    display: 'flex',
    color: 'white'
  },
  title: {
    extend: 'column'
  },
  column: {
    flex: 1
  }
}

const template = classes => `
<template>
  <article class="${classes.app}">
    <div is="Time" class="${classes.time}" timezone="Europe/Stockholm">
      <span class="${classes.title}">Sweden</span>
    </div>
    <div is="Time" class="${classes.time}" timezone="Asia/Shanghai">
      <span class="${classes.title}">Shanghai</span>
    </div>
    <div is="Time" class="${classes.time}"  timezone="America/Los_Angeles">
      <span class="${classes.title}">Los Angeles</span>
    </div>
  </article>
</template>
`

const TimeApp = extendWindowApp('TimeApp', {
  useShadow: true,
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
