import Heartbeat from '../Heartbeat'

describe ('Heartbeat', function() {
  let heart

  beforeEach(() => heart = new Heartbeat())

  it ('does not flush if there are no callbacks', function() {
    let spy = sinon.spy(window, 'requestAnimationFrame')

    heart.pump()

    spy.should.not.have.been.called

    spy.restore()
  })

  it ('can listen to callbacks', function(done) {
    heart.listen(done)
    heart.pump()
  })

  it ('batches subscriptions', function(done) {
    let stub = sinon.stub()

    heart.listen(stub)

    for (var i = 100; i > 0; i--) {
      heart.pump()
    }

    requestAnimationFrame(() => {
      stub.should.have.been.calledOnce
      done()
    })
  })

  it ('can ignore callbacks', function(done) {
    let stub = sinon.stub()

    heart.listen(stub)
    heart.ignore(stub)
    heart.pump()

    requestAnimationFrame(() => {
      stub.should.not.have.been.called
      done()
    })
  })

})
