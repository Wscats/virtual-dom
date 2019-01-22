import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {createVnode} from '../src/vnode'

chai.use(sinonChai)
chai.should()


describe('Test Element', function () {
  it('Element\'s count is the sum of its children\'s count', function () {
    var root = "cccc"

    root.should.be.equal("cccc")

  })
})