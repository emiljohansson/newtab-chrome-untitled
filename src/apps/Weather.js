import Subject from 'core/Subject'

const updateSubject = Subject()

const getWeather = unit => {
  // const query = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="denver, co") and u="${unit}"`
  const query = `select item.condition from weather.forecast where woeid = 2391279 and u="${unit}"`
  const url = `https://query.yahooapis.com/v1/public/yql?q=${encodeURI(query)}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`
  const httpRequest = new window.XMLHttpRequest()
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
    const condition = data.query.results.channel.item.condition

    updateSubject.next({
      channel,
      temp: condition.temp,
      unit: unit.toUpperCase()
    })
    resolved = true
  }
  httpRequest.open('GET', url, true)
  httpRequest.send()
}

const tempStyle = {
  display: 'inline-block',
  position: 'relative',

  '.degree-sign &::after': {
    content: '\'\'',
    position: 'absolute',
    top: '13px',
    border: '1px solid',
    borderRadius: '50%',
    padding: '4.5px'
  }
}

const styles = {
  weather: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  f: {
    extend: tempStyle,
    display: 'none',
    '.fahrenheit &': {
      display: 'block'
    }
  },
  c: {
    extend: tempStyle,
    '.fahrenheit &': {
      display: 'none'
    }
  },
  unit: {
    '.degree-sign &': {
      display: 'none'
    }
  }
}

const template = `
<article class="weather" o-class="{
  degree-sign: useDegreeSign,
  fahrenheit: isFahrenheit
}" o-on-click="onClick">
  <div class="f">{{fahrenheit}}<span class="unit">F</span></div>
  <div class="c">{{celsius}}<span class="unit">C</span></div>
</article>
`

const Weather = {
  useShadow: true,
  styles,
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
