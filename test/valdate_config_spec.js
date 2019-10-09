'use strict'

var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')

var validate_config = require('../src/validate_config.js')
var config;

describe('Testing validate_config.js', () => {

  beforeEach(() => {
    config = {
      interface: 'eth0',
      network: 'my network',
      range: ['start ip', 'end ip'],
      netmask: 'my netmaskk',
      router: 'my router ip',
      dns: ['dns1', 'dns2'],
      broadcast: 'my broadcast',
      static: []
    }
  })

  it('should reject error if required options missing', () => {
    var required_opts = [
      'interface',
      'network',
      'range',
      'netmask',
      'dns',
      'broadcast',
      'router'
    ]
    return Promise.all(required_opts.map(opt => {
      var _config = Object.assign({}, config)
      delete _config[opt]
      return validate_config(_config).then(expect.fail, e => {
        expect(e).to.equal('Missing required option: ' + opt)
      })
    }))
  })

  it('reject if no config is provided', () => {
    return validate_config().then(expect.fail, e => expect(e).to.be.an('error'))
  })

  it('should reject if range is not array', () => {
    config.range = 'adfdasf'
    return validate_config(config).then(expect.fail, e => {
      expect(e).to.equal('DHCP ip pool range must be array')
    })
  })

  it('should accept string router option', () => {
    config.router = '10.0.0.1'
    return validate_config(config).then(cfg => {
      var expected_config = Object.assign({}, config)
      expected_config.router = ['10.0.0.1']
      expect(cfg).to.eql(expected_config)
    })
  })

  it('should accept array router option', () => {
    config.router = ['10.0.0.1']
    return validate_config(config).then(cfg => {
      expect(cfg).to.eql(config)
    })
  })

  it('should accept string dns option', () => {
    config.dns = '10.0.0.1'
    return validate_config(config).then(cfg => {
      var expected_config = Object.assign({}, config)
      expected_config.dns = ['10.0.0.1']
      expect(cfg).to.eql(expected_config)
    })
  })

  it('should accept array dns option', () => {
    config.dns = ['10.0.0.1']
    return validate_config(config).then(cfg => {
      expect(cfg).to.eql(config)
    })
  })

  it('should reject if router is not string or array', () => {
    config.router = true
    return validate_config(config).then(expect.fail, e => {
      expect(e).to.equal('router option must be of type string or array')
    })
  })

  it('should reject if dns is not string or array', () => {
    config.dns = true
    return validate_config(config).then(expect.fail, e => {
      expect(e).to.equal('dns option must be of type string or array')
    })
  })

  it('should reject if static option is not array', () => {
    config.static = {}
    return validate_config(config).then(expect.fail, e => {
      expect(e).to.eql('static option must be of type array')
    })
  })

  it('should add empty array as placeholder for static option if none is provided', () => {
    config.static = null
    return validate_config(config).then(cfg => {
      expect(cfg.static).to.eql([])
    })
  })


})
