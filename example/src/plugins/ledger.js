/**
 * Render
 * Render changes to the screen
 */

import React  from 'react'
import Layout from '../views/layout'

var signals = []

var play = window.play = function() {
  app.reset()

  signals.forEach(function(signal, i) {
    setTimeout(function() {
      signal.pipe(result => app.dispatch(signal.action, result))
    }, i * 500)
  })
}

export default {

  actionWillDispatch(app, signal) {
    signals.push(signal)
  },

  render(app, el) {
    React.render(<Layout app={ app } { ...app.toObject() }/>, el)
  },

  register(app, { el }, next) {
    window.app = app
    app.listen(() => this.render(app, el))

    this.render(app, el)

    next()
  }

}
