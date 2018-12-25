import Instance from '../core/Instance'
import install from '../core/install'
import apps from '../core/apps'

import Root from './Root'
import Map from './Map'
import Tile from './Tile'

install('Root', Root)
install('Map', Map)
install('Tile', Tile)

Instance(apps('Root'), document.querySelector(`[is=Root]`))
