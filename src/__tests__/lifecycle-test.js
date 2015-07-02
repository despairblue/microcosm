import Microcosm from '../Microcosm'

describe('Lifecycle methods', function() {

  it ('monitors when an app will start', function(done) {
    let app = new Microcosm()

    sinon.spy(app, 'reset')

    app.addPlugin({
      willStart(instance) {
        app.reset.should.not.have.been.called
        instance.should.equal(app)
        done()
      }
    })

    app.start()
  })

  it ('monitors when an app has started, after all callbacks have run', function(done) {
    let app    = new Microcosm()
    let called = false

    app.addPlugin({
      didStart(instance) {
        called.should.equal(true)
        instance.should.equal(app)
        done()
      }
    })

    app.start(function() {
      called = true
    })
  })

  it ('tells plugins when an app has reset', function(done) {
    let app = new Microcosm()

    app.addPlugin({
      didReset(instance) {
        instance.should.equal(app)
        done()
      }
    })

    app.start()
  })

  it ('tells plugins before and after an update occurs', function(done) {
    let app = new Microcosm()

    app.addPlugin({
      willUpdate(instance) {
        instance.state.should.not.have.property('test')
      },

      didUpdate(instance) {
        instance.state.should.have.property('test', 5)
      },

      register(app, options, next) {
        next()
      }
    })

    let action = n => n

    app.addStore('test', {
      register() {
        return {
          [action]: (state, n) => n
        }
      }
    })

//    app.start()
    app.push(action, 5, done)
  })

})
