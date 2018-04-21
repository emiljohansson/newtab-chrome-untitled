import jss from 'jss'
import extendWindowApp from 'apps/WindowApp'

const { classes } = jss.createStyleSheet({
  app: {
    color: 'white',
    fontSize: '4rem',
    fontWeight: '300',
    textAlign: 'center'
  },
  icon: {
    opacity: 0,

    '.ready &': {
      opacity: 1
    }
  },
  condition: {
    fontSize: '1rem'
  }
}).attach()

const template = `
<article class="${classes.app}" o-class="{
  ready: isReady
}">
  <i class="fas ${classes.icon}"></i>
  <div is="Weather"
    use-degree-sign="true"
    o-emit-channel-retrieved="onChannelRetrieved"></div>
  <div class="${classes.condition}">{{condition}}</div>
</article>
`

const getStyleByCondition = condition => {
  const style = {
    background: '',
    icon: 'exclamation'
  }
  switch (condition) {
    case 'Sunny':
    case 'Mostly Sunny':
      style.background = 'linear-gradient(to right, rgba(251,179,64,1) 0%, rgba(245,130,85,1) 100%)'
      style.icon = 'sun'
      break
    case 'Rainy':
      style.background = 'linear-gradient(to bottom, rgba(73,155,234,1) 0%, rgba(32,124,229,1) 100%)'
      style.icon = 'tint'
      break
    case 'Snowy':
      style.background = 'linear-gradient(to bottom, rgba(147,206,222,1) 0%, rgba(117,189,209,1) 41%, rgba(73,165,191,1) 100%)'
      style.icon = 'snowflake'
      break
    case 'Partly Cloudy':
    case 'Breezy':
      style.background = 'linear-gradient(rgb(147, 206, 222) 0%, rgb(117, 189, 209) 41%, rgb(118, 191, 73) 100%)'
      style.icon = 'cloud'
  }
  return style
}

const WeatherApp = extendWindowApp('WeatherApp', {
  template,
  data: {
    condition: '',
    isReady: false,
    isSunny: false,
    isRainy: false
  },
  windowSettings: {
    background: 'white'
  }
})

WeatherApp.created = function () {
  // console.log('created', this.windowSettings)
}

WeatherApp.mounted = function () {
}

WeatherApp.onChannelRetrieved = function (channelData) {
  const condition = channelData.item.condition.text
  console.log(condition)
  const iconEl = this.$el.querySelector('.svg-inline--fa') || this.$el.querySelector('.fas')
  const style = getStyleByCondition(condition)
  iconEl.classList.add(`fa-${style.icon}`)

  this.condition = condition
  this.isReady = true
  this.windowSettings.update(style)
}

export default WeatherApp