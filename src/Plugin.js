const uid  = require('uid')
const skip = () => {}

function Plugin(config, options) {
  for (var i in config) {
    this[i] = config[i]
  }

  this.name    = this.name || 'microcosm_plugin_' + uid()
  this.options = options
}

Plugin.prototype = {
  didStart     : skip,
  willDispatch : skip,
  didDispatch  : skip,

  _start(app, next) {
    return this.register(app, this.options, next)
  },

  register(app, options, next) {
    next()
  },

  toString() {
    return this.name
  }
}

module.exports = Plugin
