
var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')

var code = 0
var file = '../src/service.js'
var spawn_instance = {
  on: (e, cb) => {
    process.nextTick(() => cb(code))
  }
}
var spawn = sinon.fake((cmd, args) => spawn_instance)
var service;

describe('Testing start/stop/restart methods', () => {

  beforeEach(() => {
    service = proxyquire(file, {
      child_process: {spawn}
    })
  })

  describe('_sendCommand() method', () => {
    it('should resolve is status code is 0', () => {
      code = 0
      return service.start()
        .then(() => {
          sinon.assert.calledWithExactly(spawn, 'systemctl', ['start', 'isc-dhcp-server'])
        })
    })
    it('should reject if status code is not 0', () => {
      code = 2
      return service.start()
        .then(expect.fail, e => {
          expect(e).to.equal('Unable to start DHCP server')
        })
    })
  })

  describe('start/stop/restart methods', () => {

    var cmd_stub

    beforeEach(() => {
      cmd_stub = sinon.stub(service, '_sendCommand').resolves()
    })

    it('should send proper commands', () => {
      var actions = ['start', 'stop', 'restart']
      return Promise.all(actions.map(action => {
        var fn = service[action]
        return fn().then(() => {
          sinon.assert.calledWithExactly(cmd_stub, action)
        })
      }))
    })

    afterEach(() => cmd_stub.restore())

  })

})

