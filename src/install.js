/**
 * Install
 * A simple FIFO queue for installing plugins
 */

let install = function (plugins, done) {
  if (!plugins.length) {
    return done(null)
  }

  let plugin = plugins[0]
  let tail   = plugins.slice(1)

  return plugin.register(plugin.app, plugin.options, function(err) {
    err ? done(err) : install(tail, done)
  })
}

module.exports = install
