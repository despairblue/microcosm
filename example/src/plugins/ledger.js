/**
 * Render
 * Render changes to the screen
 */

var commits = []

export default {

  willDispatch(app, signal, action, result) {
    commits.push({ signal, action, result })
  },

  register(app, _, next) {

    window.replay = function() {
      console.log('Replaying...')

      app.reset()

      commits.forEach(function({ action, result }, i) {
        setTimeout(function() {
          console.log('%s. %s', i, action)
          app.dispatch(action, result)
        }, i * 500)
      })
    }

    next()
  }

}
