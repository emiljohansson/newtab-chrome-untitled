import jss from 'jss'
import { Subject } from 'rxjs/Subject'

const updateSubject = new Subject()

const getWeather = unit => {
  const query = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="denver, co") and u="${unit}"`
  const url = `https://query.yahooapis.com/v1/public/yql?q=${encodeURI(query)}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`
  const httpRequest = new XMLHttpRequest()
  let resolved = false
  httpRequest.onreadystatechange = () => {
    if (!httpRequest.response || resolved) {
      return
    }
    let data
    try {
      data = JSON.parse(httpRequest.response)
    } catch (e) {}
    if (data == null) {
      return
    }
    const channel = data.query.results.channel
    const location = data.query.results.channel.location
    const condition = data.query.results.channel.item.condition

    updateSubject.next({
      channel,
      city: location.city,
      region: location.region,
      temp: condition.temp,
      unit: unit.toUpperCase()
    })
    resolved = true
  }
  httpRequest.open('GET', url, true)
  httpRequest.send()
}

export const { classes } = jss.createStyleSheet({
  weather: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  temp: {
    display: 'inline-block',
    position: 'relative',

    '.degree-sign &::after': {
      content: '\'\'',
      position: 'absolute',
      top: '21px',
      border: '1px solid',
      borderRadius: '50%',
      padding: '4px',
    }
  },
  f: {
    extend: 'temp',
    display: 'none',
    '.fahrenheit &': {
      display: 'block'
    }
  },
  c: {
    extend: 'temp',
    '.fahrenheit &': {
      display: 'none'
    }
  },
  unit: {
    '.degree-sign &': {
      display: 'none'
    }
  }
}).attach()

const template = `
<article class="${classes.weather}" o-class="{
  degree-sign: useDegreeSign,
  fahrenheit: isFahrenheit
}" o-on-click="onClick">
  <div class="${classes.f}">{{fahrenheit}}<span class="${classes.unit}">F</span></div>
  <div class="${classes.c}">{{celsius}}<span class="${classes.unit}">C</span></div>
</article>
`

const Weather = {
  template,
  data: {
    useDegreeSign: false,
    channel: undefined,
    celsius: '',
    fahrenheit: '',
    isFahrenheit: false
  }
}

Weather.mounted = function () {
  updateSubject.subscribe(state => {
    if (this.channel == null) {
      this.channel = state.channel
      this.$emit('channelRetrieved', this.channel)
    }
    if (state.unit === 'C') {
      this.celsius = `${state.temp}`
      return
    }
    this.fahrenheit = `${state.temp}`
  })
  getWeather('c')
  getWeather('f')
}

Weather.onClick = function (event) {
  this.isFahrenheit = !this.isFahrenheit
}

export default Weather
