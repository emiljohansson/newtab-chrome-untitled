const colStyle = {
  flex: '1',

  '& > div': {
    display: 'inline-block'
  }
}

const styles = {
  ':host': {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: '0.8rem',
    height: '20px',
    padding: `0 1rem`
  },
  leftCol: {
    extend: colStyle
  },
  rightCol: {
    extend: colStyle,
    textAlign: 'right'
  },
  appMenu: {
  }
}

const template = `
<div class="leftCol">
  <div class="appMenu"
   o-on-click="onAppMenuClick()">
    <i class="fas fa-bars"></i>
  </div>
</div>
<div class="rightCol">
  <div is="Weather"></div>
  <div is="Time" timezone="America/Denver"></div>
</div>
<link rel="stylesheet" href="vendor/css/fontawesome-all.min.css">
`

const StatusBar = {
  debug: true,
  styles,
  template,
  data: {
    isActive: true
  }
}

StatusBar.mounted = function () {}

StatusBar.onAppMenuClick = function () {
  console.log('click')
}

export default StatusBar
