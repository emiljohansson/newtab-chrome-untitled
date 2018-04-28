import jss from 'jss'
import preset from 'jss-preset-default'
import Instance from 'core/Instance'
import install from 'core/install'
import apps from 'core/apps'

jss.setup(preset())

const sheet = jss.createStyleSheet({
  '@global :host': {
    background: 'green'
  },
  'body': {
    background: 'yellow'
  }
})
console.log(sheet)
console.log(sheet.toString())

// const composeElements = (App, elements) => {
//   elements = toArray(elements)
//   elements.forEach(initEl => {
//     compose(App, initEl)
//   })
// }
//
// const appList = [
//   require('./apps/Weather').default,
// ]
//
// forEach(appList, App => {
//   init(App)
// })
//
// forEach(appList, App => {
//   initStyle(App)
//   composeElements(App, document.querySelectorAll(`[is=${App.reference}]`))
// })

// V2 test

install('OS', require('apps/OS').default)
install('Desktop', require('apps/Desktop').default)
install('Window', require('apps/Window').default)
install('TimeApp', require('apps/Time/TimeApp').default)
install('Time', require('apps/Time/Time').default)
install('WeatherApp', require('apps/Weather/WeatherApp').default)
install('Weather', require('apps/Weather').default)
install('Todo', require('apps/Todos/Todo').default)
install('Todos', require('apps/Todos/Todos').default)
install('Playground', require('apps/Playground').Playground)
install('PlaygroundItem', require('apps/Playground').PlaygroundItem)
install('PlaygroundIfItem', require('apps/Playground').PlaygroundIfItem)
install('StatusBar', require('apps/StatusBar').default)
install('Puzzle', require('apps/Puzzle/Puzzle').default)
install('PuzzleItem', require('apps/Puzzle/PuzzleItem').default)
install('Terminal', require('apps/Terminal/Terminal').default)
install('TestApp', require('apps/TestApp').default)
install('TestComponent', require('apps/TestComponent').default)

Instance(apps('OS'), document.querySelector(`[is=OS]`))

// forEach([
//   'Time',
//   'Weather',
//   'Todos',
//   'Playground',
//   'StatusBar'
// ], id => {
//   forEach(document.querySelectorAll(`[is=${id}]`), el => {
//     Instance(apps(id), el)
//   })
// })
