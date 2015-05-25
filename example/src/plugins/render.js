/**
 * Render
 * Render changes to the screen
 */

import React  from 'react'
import Layout from '../views/layout'

export default {
  didStart(app) {
    this.render(app)
  },

  didDispatch(app) {
    this.render(app)
  },

  render(app) {
    React.render(<Layout app={ app } { ...app.toObject() }/>,
                 this.options.el)
  }
}
