import Instance from '../core/Instance'
import install from '../core/install'
import apps from '../core/apps'

import OS from './OS'
import Desktop from './Desktop'
import Window from './Window'
import TimeApp from './Time/TimeApp'
import Time from './Time/Time'
import WeatherApp from './Weather/WeatherApp'
import Weather from './Weather'
import Todo from './Todos/Todo'
import Todos from './Todos/Todos'
import { Playground, PlaygroundItem, PlaygroundIfItem } from './Playground'
import StatusBar from './StatusBar'
import Puzzle from './Puzzle/Puzzle'
import PuzzleItem from './Puzzle/PuzzleItem'
import Terminal from './Terminal/Terminal'

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
