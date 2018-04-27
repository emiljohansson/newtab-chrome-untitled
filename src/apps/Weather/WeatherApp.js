import {create} from 'jss'
import camelCase from 'jss-camel-case'
import extendWindowApp from 'apps/WindowApp'

const jss = create({
  insertionPoint: document.body
})
jss.use(camelCase())
const styleSheet = jss.createStyleSheet({
  root: {
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
})

const template = `
<article class="${styleSheet.classes.root}" o-class="{
  ready: isReady
}">
  <i class="fas ${styleSheet.classes.icon}"></i>
  <div is="Weather"
    use-degree-sign="true"
    o-emit-channel-retrieved="onChannelRetrieved"></div>
  <div class="${styleSheet.classes.condition}">{{condition}}</div>
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
    case 'Snowy':
    case 'Rain And Snow':
      style.background = 'linear-gradient(to bottom, rgba(147,206,222,1) 0%, rgba(117,189,209,1) 41%, rgba(73,165,191,1) 100%)'
      style.icon = 'snowflake'
      break
    case 'Rainy':
    case 'Showers':
    case 'Scattered Thunderstorms':
      style.background = 'linear-gradient(to bottom, rgba(73,155,234,1) 0%, rgba(32,124,229,1) 100%)'
      style.icon = 'tint'
      break
    case 'Partly Cloudy':
    case 'Breezy':
    case 'Clear':
    case 'Cloudy':
    case 'Mostly Cloudy':
    case 'Mostly Clear':
      style.background = 'linear-gradient(rgb(147, 206, 222) 0%, rgb(117, 189, 209) 41%, rgb(118, 191, 73) 100%)'
      style.icon = 'cloud'
  }
  return style
}

const WeatherApp = extendWindowApp('WeatherApp', {
  useShadow: true,
  styleSheet,
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
