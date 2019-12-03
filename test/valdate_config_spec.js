'use strict'

var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')

var validate = require('../src/validate_config.js')
var config;

describe('Testing validate_config.js', () => {

  beforeEach(() => {
    config = {
      interface: 'eth0',
      network: '192.168.1.1',
      range: ['192.168.1.100', '192.168.1.200'],
      netmask: '255.255.255.0',
      router: '192.168.1.1',
      dns: ['1.1.1.1', '8.8.8.8'],
      broadcast: '192.168.1.255',
      static: []
    }
  })

  describe('validateConfig()', () => {


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
        return validate.validateConfig(_config).then(expect.fail, e => {
          expect(e).to.equal('Missing required option: ' + opt)
        })
      }))
    })

    it('reject if no config is provided', () => {
      return validate.validateConfig().then(expect.fail, e => expect(e).to.be.an('error'))
    })

    describe('network option', () => {
      it('should reject if network is not valid ip', () => {
        config.network = 'asdfadf'
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Network must be a valid IP')
        })
      })
    })

    describe('netmask option', () => {
      it('should reject if netmask is not valid ip', () => {
        config.netmask = 'asdfadf'
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Netmask must be a valid IP')
        })
      })
    })

    describe('broadcast option', () => {
      it('should reject if netmask is not valid ip', () => {
        config.broadcast = 'asdfadf'
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Broadcast address must be a valid IP')
        })
      })
    })


    describe('range option', () => {
      it('should reject if range is not array', () => {
        config.range = 'adfdasf'
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('DHCP ip pool range must be array')
        })
      })

      it('should reject if pool start is not valid ip', () => {
        config.range  = ['asdfsdf', '10.0.0.1']
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Invalid DHCP pool range')
        })
      })

      it('should reject if pool end is not valid ip', () => {
        config.range  = ['192.168.1.1', 'asdfasdf']
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Invalid DHCP pool range')
        })
      })

      it('should reject if range is not same network', () => {
        config.range  = ['192.168.1.1', '10.0.0.1']
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Invalid DHCP pool range')
        })
      })
    })

    describe('router option', () => {

      it('should accept string router option', () => {
        config.router = '10.0.0.1'
        return validate.validateConfig(config).then(cfg => {
          var expected_config = Object.assign({}, config)
          expected_config.router = ['10.0.0.1']
          expect(cfg).to.eql(expected_config)
        })
      })

      it('should accept array router option', () => {
        config.router = ['10.0.0.1']
        return validate.validateConfig(config).then(cfg => {
          expect(cfg).to.eql(config)
        })
      })

      it('should reject if router option is not valid ip', () => {
        config.router = 'asdfadf'
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Gateway must be a valid IP')
        })
      })

      it('should reject if router option is not valid ip', () => {
        config.router = ['asdfadf']
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('Gateway must be a valid IP')
        })
      })

      it('should reject if router is not string or array', () => {
        config.router = true
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('router option must be of type string or array')
        })
      })

    })

    describe('dns option', () => {
      it('should accept string dns option', () => {
        config.dns = '10.0.0.1'
        return validate.validateConfig(config).then(cfg => {
          var expected_config = Object.assign({}, config)
          expected_config.dns = ['10.0.0.1']
          expect(cfg).to.eql(expected_config)
        })
      })

      it('should accept array dns option', () => {
        config.dns = ['10.0.0.1']
        return validate.validateConfig(config).then(cfg => {
          expect(cfg).to.eql(config)
        })
      })

      it('should reject if dns is not string or array', () => {
        config.dns = true
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('dns option must be of type string or array')
        })
      })

      it('should reject if dns is not valid ip', () => {
        config.dns = 'asdfa'
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.equal('DNS must be valid IP(s)')
        })
      })
    })

    describe('static option', () => {

      it('should reject if static option is not array', () => {
        config.static = {}
        return validate.validateConfig(config).then(expect.fail, e => {
          expect(e).to.eql('static option must be of type array')
        })
      })

      it('should add empty array as placeholder for static option if none is provided', () => {
        config.static = null
        return validate.validateConfig(config).then(cfg => {
          expect(cfg.static).to.eql([])
        })
      })

    })

  })

  describe('validateAll()', () => {

    it('should reject if there are overlapping networks', () => {
      var config2 = Object.assign({}, config)
      config2.interface = 'eth1'
      var configs = [config, config2]
      return validate.validateAll(configs)
        .then(expect.fail, e => {
          expect(e).to.equal('Network configuration conflict/overlapping')
        })
    })

    it('should accept valid networks', () => {
      var config2 = {
        interface: 'eth1',
        network: '192.168.2.1',
        range: ['192.168.2.100', '192.168.2.200'],
        netmask: '255.255.255.0',
        router: '192.168.2.1',
        dns: ['1.1.1.1', '8.8.8.8'],
        broadcast: '192.168.2.255',
        static: []
      }
      var configs = [config, config2]
      return validate.validateAll(configs)
    })

  })

})
