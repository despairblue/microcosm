import DevTools from '../../addons/devtools'
import Messages from './stores/messages'
import Microcosm from 'Microcosm'
import Render from './plugins/render'

import "./style"

let app = new Microcosm()

app.addStore('messages', Messages)

app.addPlugin(DevTools)
app.addPlugin(Render, { el: document.getElementById('app') })

app.start()
