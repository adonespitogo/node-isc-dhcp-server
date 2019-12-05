'use strict'

var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')

var dhcp,
  config,
  new_config,
  validate,
  template,
  service,
  writer;

describe('Testing isc-dhcp-server package', () => {

  beforeEach(() => {
    template = require('../src/template.js')
    service = require('../src/service.js')
    writer = {
      iscDefaultConfig: sinon.fake.resolves(),
      dhcpdConfig: sinon.fake.resolves()
    }
    config = {
      interface: 'eth0',
      network: 'my network',
      range: ['start ip', 'end ip'],
      netmask: 'my netmaskk',
      router: 'my router ip',
      dns: ['dns1', 'dns2'],
      broadcast: 'my broadcast'
    }

    new_config = Object.assign({}, config)
    new_config.router = ['new router ip']
    validate = {
      validateConfig: sinon.fake.resolves(new_config),
      validateAll: sinon.fake.resolves()
    }

    dhcp = proxyquire('../src/index.js', {
      './validate_config.js': validate,
      './service.js': service,
      './template.js': template,
      './writer.js': writer
    })
  })

  it('should createServer method', () => {
    var s = dhcp.createServer(config)
    expect(s.start).to.be.a('function')
    expect(s.restart).to.be.a('function')
    expect(s.stop).to.be.a('function')
  })

  describe('validate() method', () => {
    describe('when config is object', () => {

      it('should indicate which interace has config error', () => {
        var error = 'some error'
        validate = {
          validateConfig: sinon.fake.resolves(Promise.reject(error))
        }
        dhcp = proxyquire('../src/index.js', {
          './validate_config.js': validate,
        })
        var s = dhcp.createServer(config)
        return s.validate().then(expect.fail, e => {
          expect(e).to.equal(`Configuration error for interface ${config.interface}: ${error}`)
        })
      })

      it('should validate array config', () => {
        var error = 'some error'
        validate = {
          validateConfig:  sinon.fake.resolves(config),
          validateAll: sinon.fake.resolves()
        }
        dhcp = proxyquire('../src/index.js', {
          './validate_config.js': validate,
        })
        var s = dhcp.createServer([config])
        return s.validate().then(cfg => {
          expect(cfg).to.eql([config])
          sinon.assert.calledWithExactly(validate.validateConfig, config)
          sinon.assert.calledWithExactly(validate.validateAll, [config])
          sinon.assert.callOrder()
        })
      })

    })

  })

  describe('prestart() method', () => {
    it('should validate, write and start the service', () => {
      var s = dhcp.createServer([config])
      return s.prestart()
        .then(() => {
          sinon.assert.calledWithExactly(validate.validateConfig, config)
          sinon.assert.calledWithExactly(validate.validateAll, [new_config])
          sinon.assert.calledWithExactly(writer.iscDefaultConfig, [new_config])
          sinon.assert.calledWithExactly(writer.dhcpdConfig, [new_config])
        })
    })
  })

  describe('start method', () => {
    it('should call prestart before calling service', () => {
      var s = dhcp.createServer(config)
      var prestart_stub = sinon.stub(s, 'prestart').resolves()
      var service_start_stub = sinon.stub(service, 'start').resolves()
      return s.start()
        .then(() => {
          sinon.assert.calledOnce(prestart_stub)
          sinon.assert.calledOnce(service_start_stub)
          expect(prestart_stub.calledBefore(service_start_stub)).to.be.true
          prestart_stub.restore()
          service_start_stub.restore()
        })
    })
  })

  describe('restart method', () => {
    it('should call prestart before calling service', () => {
      var s = dhcp.createServer(config)
      var prestart_stub = sinon.stub(s, 'prestart').resolves()
      var service_start_stub = sinon.stub(service, 'restart').resolves()
      return s.restart()
        .then(() => {
          sinon.assert.calledOnce(prestart_stub)
          sinon.assert.calledOnce(service_start_stub)
          expect(prestart_stub.calledBefore(service_start_stub)).to.be.true
          prestart_stub.restore()
          service_start_stub.restore()
        })
    })
  })

  describe('stop method', () => {
    it('should call servie.stop', () => {
      var s = dhcp.createServer(config)
      var service_stop_stub = sinon.stub(service, 'stop').resolves()
      return s.stop()
        .then(() => {
          sinon.assert.calledOnce(service_stop_stub)
          service_stop_stub.restore()
        })
    })
  })

})

