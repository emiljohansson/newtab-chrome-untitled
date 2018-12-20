import Instance from './core/Instance'
import install from './core/install'
import apps from './core/apps'

import OS from './apps/OS'
// import Desktop from './apps/Desktop'
// import Window from './apps/Window'
// import TimeApp from './apps/Time/TimeApp'
// import Time from './apps/Time/Time'
// import WeatherApp from './apps/Weather/WeatherApp'
// import Weather from './apps/Weather'
// import Todo from './apps/Todos/Todo'
// import Todos from './apps/Todos/Todos'
// import { Playground, PlaygroundItem, PlaygroundIfItem } from './apps/Playground'
// import StatusBar from './apps/StatusBar'
// import Puzzle from './apps/Puzzle/Puzzle'
// import PuzzleItem from './apps/Puzzle/PuzzleItem'
// import Terminal from './apps/Terminal/Terminal'

install('OS', OS)
// install('Desktop', Desktop)
// install('Window', Window)
// install('TimeApp', TimeApp)
// install('Time', Time)
// install('WeatherApp', WeatherApp)
// install('Weather', Weather)
// install('Todo', Todo)
// install('Todos', Todos)
// install('Playground', Playground)
// install('PlaygroundItem', PlaygroundItem)
// install('PlaygroundIfItem', PlaygroundIfItem)
// install('StatusBar', StatusBar)
// install('Puzzle', Puzzle)
// install('PuzzleItem', PuzzleItem)
// install('Terminal', Terminal)

Instance(apps('OS'), document.querySelector(`[is=OS]`))
