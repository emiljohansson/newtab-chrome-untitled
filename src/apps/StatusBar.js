import jss from 'jss'
import * as spacing from 'style/spacing'

const { classes } = jss.createStyleSheet({
  statusBar: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '0.8rem',
    height: '20px'
  },
  col: {
    flex: '1',
    '& > *': {
      display: 'inline-block'
    }
  },
  leftCol: {
    extend: 'col'
  },
  rightCol: {
    extend: 'col',
    textAlign: 'right'
  },
  appMenu: {
  }
}).attach()

const template = `
<article class="${classes.statusBar} ${spacing.classes.px_m}">
  <div class="${classes.leftCol}">
    <div class="${classes.appMenu}"
     o-on-click="onAppMenuClick()">
      <i class="fas fa-bars"></i>
    </div>
  </div>
  <div class="${classes.rightCol}">
    <div is="Weather"></div>
    <div is="Time" timezone="America/Denver"></div>
  </div>
</article>
`

const StatusBar = {
  template,
  data: {
    isActive: true
  }
}

StatusBar.mounted = function () {
  // this.element is ready
}

StatusBar.onAppMenuClick = function () {
  console.log('click')
}

export default StatusBar
