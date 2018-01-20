import { forEach } from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import Instance from 'core/Instance'
// import { compose, init } from 'core-dep/App'

jss.setup(preset())

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

import app from 'core/app'
import apps from 'core/apps'

app('OS', require('apps/OS').default)
app('Desktop', require('apps/Desktop').default)
app('Window', require('apps/Window').default)
app('TimeApp', require('apps/Time/TimeApp').default)
app('Time', require('apps/Time/Time').default)
app('Weather', require('apps/Weather').default)
app('Todo', require('apps/Todos/Todo').default)
app('Todos', require('apps/Todos/Todos').default)
app('Playground', require('apps/Playground').Playground)
app('PlaygroundItem', require('apps/Playground').PlaygroundItem)
app('PlaygroundIfItem', require('apps/Playground').PlaygroundIfItem)
app('StatusBar', require('apps/StatusBar').default)
app('Puzzle', require('apps/Puzzle/Puzzle').default)
app('PuzzleItem', require('apps/Puzzle/PuzzleItem').default)
app('Terminal', require('apps/Terminal/Terminal').default)

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
