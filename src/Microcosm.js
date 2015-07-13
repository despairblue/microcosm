let Diode = require('diode')
let Store = require('./Store')
let Transaction = require('./Transaction')
let flatten = require('./flatten')
let install = require('./install')
let plugin = require('./plugin')
let remap = require('./remap')
let attempt = require('./attempt')

let noop = a => a

let Microcosm = function() {
  /**
   * Microcosm uses Diode for event emission. Diode is an event emitter
   * with a single event.
   * https://github.com/vigetlabs/diode
   */
  Diode(this)

  /**
   * Represents all "merged" transactions. Whenever a transaction completes,
   * the result is folded into base state and the transaction object is
   * "released". This lets transactions execute in a predicable order while
   * not soaking up memory keeping them forever.
   */
  this.base = {}

  /**
   * Holds publically available state. The result of folding all incomplete
   * transactions over base state. This property can safely be referenced when
   * retrieving application state.
   */
  this.state = this.base

  this.started = false
  this.plugins = []
  this.stores = {}
  this.transactions = []
}

Microcosm.prototype = {
  constructor: Microcosm,

  /**
   * Generates the initial state a microcosm starts with. Called whenever
   * a microcosm runs start().
   */
  getInitialState() {
    return remap(this.stores, Store.getInitialState)
  },

  /**
   * Called before a transaction is squashed into base state. This method
   * is useful to override if you wish to preserve transaction history
   * beyond outstanding transactions.
   */
  shouldTransactionMerge(item, all) {
    return item.done
  },

  /**
   * Used to determine if a transaction should be purged during `clean()`
   */
  shouldRejectTransaction(item) {
    return item.error
  },

  /*
   * Before dispatching, this function is called on every transaction
   */
  shouldTransactionDispatch(item) {
    return item.active
  },

  /**
   * Remove invalid transactions
   */
  clean(transaction) {
    if (this.shouldRejectTransaction(transaction)) {
      this.transactions = this.transactions.filter(t => t !== transaction)
      this.lifecycle('transactionWasRejected', [ this, transaction ])
    }
  },

  /**
   * Starting from the beginning, consecutively fold complete transactions into
   * base state and remove them from the transaction list.
   */
  reconcile(transaction) {
    let isFirst = this.transactions[0] === transaction

    if (isFirst && this.shouldTransactionMerge(transaction, this.transactions)) {
      this.base = this.dispatch(this.base, this.transactions.shift())
    }

    this.lifecycle('transactionDidUpdate', [ this, transaction ])

    this.rollforward()
  },

  /**
   * Dispatch all outstanding, active transactions upon base state to determine
   * a new state. This is the state exposed to the outside world.
   */
  rollforward() {
    let next = this.transactions.reduce(this.dispatch.bind(this), this.base)

    if (next !== this.state) {
      this.state = next
      this.lifecycle('appDidUpdate', [ this ])
      this.emit(this.state)
    }
  },

  /**
   * Dispatch takes an existing state and performs the result of a transaction
   * on top of it. This is different than other Flux implementations, there
   * are no side-effects.
   *
   * Dispatch answers the question:
   * "What will change when I account for a transaction?"
   */
  dispatch(state, transaction) {
    if (this.shouldTransactionDispatch(transaction) === false) {
      return state
    }

    return remap(this.stores, function(store, key) {
      return Store.send(store, state[key], transaction)
    })
  },

  /**
   * Partially applies `push`.
   */
  prepare(action, params=[]) {
    return (more, callback) => this.push(action, flatten(params, more), callback)
  },

  /**
   * Resolves an action. As that action signals changes, it will update
   * a unique transaction. If an error occurs, it will mark it for clean up
   * and the change will disappear from history.
   */
  push(action, params, callback=noop) {
    let transaction = Transaction.create(action, params)

    this.transactions.push(transaction)

    this.lifecycle('transactionWasCreated', [ this, transaction ])

    return Transaction.run(transaction, this.reconcile, this.clean, callback, this)
  },

  /**
   * Clear all outstanding transactions and assign base state
   * to a given object (or getInitialState())
   */
  reset(state=this.getInitialState(), transactions=[]) {
    this.transactions = transactions
    this.base = state

    this.rollforward()
  },

  /**
   * Resets to a given state, passing it through deserialize first
   */
  replace(data) {
    return this.reset(this.deserialize(data))
  },

  /**
   * Pushes a plugin in to the registry for a given microcosm.
   * When `app.start()` is called, it will execute plugins in
   * the order in which they have been added using this function.
   */
  addPlugin(config, options) {
    this.plugins.push(plugin(config, options, this))
    return this
  },

  /**
   * Generates a store based on the provided `config` and assigns it to
   * manage the provided `key`. Whenever this store responds to an action,
   * it will be provided the current state for that particular key.
   */
  addStore(key, config) {
    if (process.env.NODE_ENV !== 'production' && arguments.length <= 1) {
      throw TypeError(`Microcosm::addStore expected string key but was given: ${ typeof key }. Did you forget to include the key?`)
    }

    this.stores[key] = config

    return this
  },

  /**
   * Returns an object that is the result of transforming application state
   * according to the `serialize` method described by each store.
   */
  serialize() {
    return remap(this.stores, (store, key) => Store.serialize(store, this.state[key]))
  },

  /**
   * For each key in the provided `data` parameter, transform it using
   * the `deserialize` method provided by the store managing that key.
   * Then fold the deserialized data over the current application state.
   */
  deserialize(data) {
    if (data == void 0) {
      return this.state
    }

    return remap(this.stores, function(store, key) {
      return Store.deserialize(store, data[key])
    })
  },

  /**
   * Alias for `serialize`
   */
  toJSON() {
    return this.serialize()
  },

  /**
   * Starts an application. It does a couple of things:
   *
   * 1. Calls `this.reset()` to determine initial state
   * 2. Runs through all plugins, it will terminate if any fail
   * 3. Executes the provided callback, passing along any errors
   *    generated if installing plugins fails.
   */
  start(...callbacks) {
    this.reset()

    // Queue plugins and then notify that installation has finished
    install(this.plugins, error => {
      this.started = true
      this.lifecycle('appDidStart', [ this ])

      callbacks.forEach(cb => cb.call(this, error, this))
    })

    return this
  },

  lifecycle(method, args) {
    if (!this.started) return this

    this.plugins.forEach(plugin => {
      attempt(plugin, method, args, undefined, plugin)
    })

    return this
  }
}

module.exports = Microcosm
