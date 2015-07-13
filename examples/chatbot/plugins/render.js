import Chat from '../components/chat'
import React from 'react'

export default {

  render() {
    let { app, options } = this

    React.render(<Chat app={ app } { ...app.state } />, options.el)
  },

  appDidStart() {
    this.render()
  },

  appDidUpdate() {
    this.render()
  }

}
