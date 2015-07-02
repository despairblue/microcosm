import Microcosm from '../Microcosm'

describe('Lifecycle methods', function() {

  it ('tells plugins when an app has started', function(done) {
    let app = new Microcosm()

    app.addPlugin({
      didStart(instance) {
        instance.should.equal(app)
        done()
      },
      register(app, options, next) {
        next()
      }
    })

    app.start()
  })

  it ('tells plugins when an app has reset', function(done) {
    let app = new Microcosm()

    app.addPlugin({
      didReset(instance) {
        instance.should.equal(app)
        done()
      },
      register(app, options, next) {
        next()
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
