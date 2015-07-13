let signal  = require('./signal')
let flatten = require('./flatten')

exports.create = function (action, params, callback) {
  if (process.env.NODE_ENV !== 'production' && typeof action !== 'function') {
    throw TypeError(`Tried to create Transaction for ${ action }, but it is not a function.`)
  }

  return {
    action,
    callback,
    params: flatten(params),
    active: false,
    body: null,
    done: false,
    error: null
  }
}

exports.run = function (transaction, progress, reject, done, scope) {

  return signal(transaction.action, transaction.params, function (error, body, pending) {
    transaction.active = true
    transaction.body   = body
    transaction.error  = error
    transaction.done   = transaction.done || !pending

    if (error) {
      reject.call(scope, transaction)
    }

    progress.call(scope, transaction)

    if (transaction.error || transaction.done) {
      // This is a neat trick to get around the promise try/catch
      // https://github.com/then/promise/blob/master/src/done.js
      setTimeout(done.bind(scope, error, body), 0)
    }
  })
}
