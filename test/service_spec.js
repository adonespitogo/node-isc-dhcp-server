
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

    it('should resolve if status code is 0 for all commands', () => {
      code = 0
      var actions = ['start', 'stop', 'restart']
      return Promise.all(actions.map(action => {
        var fn = service[action]
        return fn().then(() => {
          sinon.assert.calledWithExactly(spawn, 'systemctl', [action, 'isc-dhcp-server'])
        })
      }))
    })

    it('should reject if status code isnt 0 for all commands', () => {
      code = 3
      var actions = ['start', 'stop', 'restart']
      return Promise.all(actions.map(action => {
        var fn = service[action]
        return fn().then(expect.fail, e => {
          sinon.assert.calledWithExactly(spawn, 'systemctl', [action, 'isc-dhcp-server'])
          expect(e).to.equal(`Unable to ${action} DHCP server`)
        })
      }))
    })

  })

  describe('start/stop/restart methods', () => {
    it('should send proper commands', () => {
      var cmd_stub = sinon.stub(service, '_sendCommand').resolves()
      var actions = ['start', 'stop', 'restart']
      return Promise.all(actions.map(action => {
        var fn = service[action]
        return fn().then(() => {
          sinon.assert.calledWithExactly(cmd_stub, action)
        })
      }))
        .then(() => cmd_stub.restore())
    })

  })

})

