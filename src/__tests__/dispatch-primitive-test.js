let Microcosm = require('../Microcosm')

describe('When dispatching primitive values', function() {
  let app = new Microcosm()
  let add = num => num

  app.addStore('test', {
    getInitialState: () => 1,
    register() {
      return {
        [add]: (a, b) => a + b
      }
    }
  })

  beforeEach(function(done) {
    app.start(done)
  })

  it ('properly reduces from a store', function(done) {
    app.push(add, 2, function() {
      app.state.test.should.equal(app.stores.test.getInitialState() + 2)
      done()
    })
  })
})
