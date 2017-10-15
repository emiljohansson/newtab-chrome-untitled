import jss from 'jss'

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
    extend: 'col',
    paddingLeft: '16px',

    '& > *': {
      paddingRight: '4px'
    }
  },
  rightCol: {
    extend: 'col',
    paddingRight: '16px',
    textAlign: 'right',
    
    '& > *': {
      paddingLeft: '4px'
    }
  }
}).attach()

const template = `
<article class="${classes.statusBar}">
  <div class="${classes.leftCol}"></div>
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

export default StatusBar
