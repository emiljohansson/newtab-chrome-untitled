import jss from 'jss'
import preset from 'jss-preset-default'
import Instance from 'core/Instance'
import install from 'core/install'
import apps from 'core/apps'

const t0 = window.performance.now()

jss.setup(preset())

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

Instance(apps('OS'), document.querySelector(`[is=OS]`))

const t1 = window.performance.now()
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`)
