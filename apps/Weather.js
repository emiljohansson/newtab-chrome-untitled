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
    const location = data.query.results.channel.location
    const condition = data.query.results.channel.item.condition

    updateSubject.next({
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
  f: {
    display: 'none',
    '.fahrenheit &': {
      display: 'block'
    }
  },
  c: {
    '.fahrenheit &': {
      display: 'none'
    }
  }
}).attach()

const template = `
<article class="${classes.weather}" o-class="{
  fahrenheit: isFahrenheit
}" o-on-click="onClick">
  <span class="${classes.f}">{{fahrenheit}}</span>
  <span class="${classes.c}">{{celsius}}</span>
</article>
`

const Weather = {
  template,
  data: {
    celsius: '',
    fahrenheit: '',
    isFahrenheit: false
  }
}

Weather.mounted = function () {
  updateSubject.subscribe(state => {
    if (state.unit === 'C') {
      this.celsius = `${state.temp}C`
      return
    }
    this.fahrenheit = `${state.temp}F`
  })
  getWeather('c')
  getWeather('f')
}

Weather.onClick = function (event) {
  this.isFahrenheit = !this.isFahrenheit
}

export default Weather
