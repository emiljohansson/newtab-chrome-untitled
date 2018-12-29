import Instance from '../core/Instance'
import install from '../core/install'
import apps from '../core/apps'

import Root from './Root'
import Playground from './Playground'
import SimpleText from './SimpleText'
import ElementTexts from './ElementTexts'

install('Root', Root)
install('Playground', Playground)
install('SimpleText', SimpleText)
install('ElementTexts', ElementTexts)

Instance(apps('Root'), document.querySelector(`[is=Root]`))
