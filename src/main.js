import Instance from './core/Instance.js'
import install from './core/install.js'
import apps from './core/apps.js'

import OS from './apps/OS.js'
import Desktop from './apps/Desktop.js'
import Window from './apps/Window.js'
import TimeApp from './apps/Time/TimeApp.js'
import Time from './apps/Time/Time.js'
import WeatherApp from './apps/Weather/WeatherApp.js'
import Weather from './apps/Weather.js'
import Todo from './apps/Todos/Todo.js'
import Todos from './apps/Todos/Todos.js'
import { Playground, PlaygroundItem, PlaygroundIfItem } from './apps/Playground.js'
import StatusBar from './apps/StatusBar.js'
import Puzzle from './apps/Puzzle/Puzzle.js'
import PuzzleItem from './apps/Puzzle/PuzzleItem.js'
import Terminal from './apps/Terminal/Terminal.js'

install('OS', OS)
install('Desktop', Desktop)
install('Window', Window)
install('TimeApp', TimeApp)
install('Time', Time)
install('WeatherApp', WeatherApp)
install('Weather', Weather)
install('Todo', Todo)
install('Todos', Todos)
install('Playground', Playground)
install('PlaygroundItem', PlaygroundItem)
install('PlaygroundIfItem', PlaygroundIfItem)
install('StatusBar', StatusBar)
install('Puzzle', Puzzle)
install('PuzzleItem', PuzzleItem)
install('Terminal', Terminal)

Instance(apps('OS'), document.querySelector(`[is=OS]`))
