
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
var start_stop;

describe('Testing start/stop methods', () => {

  beforeEach(() => {
    start_stop = proxyquire(file, {
      child_process: {spawn}
    })
  })

  describe('start() method', () => {
    it('should resolve is status code is 0', () => {
      code = 0
      return start_stop.start()
        .then(() => {
          sinon.assert.calledWithExactly(spawn, 'systemctl', ['start', 'isc-dhcp-server'])
        })
    })
    it('should reject if status code is not 0', () => {
      code = 2
      return start_stop.start()
        .then(expect.fail, e => {
          expect(e).to.equal('Unable to start DHCP server')
        })
    })
  })

  describe('stop() method', () => {
    it('should resolve is status code is 0', () => {
      code = 0
      return start_stop.stop()
        .then(() => {
          sinon.assert.calledWithExactly(spawn, 'systemctl', ['stop', 'isc-dhcp-server'])
        })
    })
    it('should reject if status code is not 0', () => {
      code = 2
      return start_stop.stop()
        .then(expect.fail, e => {
          expect(e).to.equal('Unable to stop DHCP server')
        })
    })
  })

  describe('restart() method', () => {
    it('should resolve is status code is 0', () => {
      code = 0
      return start_stop.restart()
        .then(() => {
          sinon.assert.calledWithExactly(spawn, 'systemctl', ['restart', 'isc-dhcp-server'])
        })
    })
    it('should reject if status code is not 0', () => {
      code = 2
      return start_stop.restart()
        .then(expect.fail, e => {
          expect(e).to.equal('Unable to restart DHCP server')
        })
    })
  })


})
