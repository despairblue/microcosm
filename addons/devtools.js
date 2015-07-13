export default {

  appDidStart() {
    console.log('Application was started')
  },

  appDidUpdate(app, transaction) {
    console.log('Application state update')
  },

  transactionWasCreated(app, { pending, action }) {
    console.log('Pushed %s', action.name)
  },

  transactionDidUpdate(app, { action, done }) {
    this.post(app, 'update')
    console.log('Updated %s (%s)', action.name, done ? 'done' : 'still pending')
  },

  transactionWasRejected(app, { action, error }) {
    console.log('Rejected transaction for %s (%s)', action.name, error)
  },

  serializeTransaction(item) {
    return Object.assign({}, item, { action: item.action.name })
  },

  post(app, type) {
    window.postMessage({
      payload : {
        type,
        stores : app.stores.length,
        state  : app.toJSON(),
        transactions : app.transactions.map(this.serializeTransaction)
      },
      source  : 'microcosm-devtools'
    }, '*')
  },

  register(app, options, next) {
    next()
  }

}
