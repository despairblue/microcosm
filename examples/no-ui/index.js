/**
 * This example is designed to help with profiling memory usage
 * and other performance characteristics
 */

import Microcosm from 'Microcosm'
import DevTools  from '../../addons/devtools'

const app  = new Microcosm()
const tick = () => Date.now()

app.addStore('time', {
  getInitialState: tick,
  register() {
    return {
      [tick]: this.set
    }
  },
  set(old, time) {
    return time
  }
})

app.addPlugin(DevTools)

app.start(function loop () {
  requestAnimationFrame(loop)
  app.push(tick)
})
