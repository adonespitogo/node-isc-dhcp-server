'use strict'

var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')
var tpl = require('../src/template.js')

describe('config template generator', () => {

  describe('generateSubnet() method', () => {
    it('should generate the subnet portion of config', () => {
      var config = {
        network: '10.0.0.0',
        range: ['10.0.0.3', '10.0.15.254'],
        netmask: '255.255.240.0',
        broadcast: '10.0.15.255',
        router: ['10.0.0.1', '10.0.0.2'],
        dns: ['10.0.0.1', '8.8.8.8']
      }

      var expected_output = `
subnet 10.0.0.0 netmask 255.255.240.0 {
  range 10.0.0.3 10.0.15.254;
  option broadcast-address 10.0.15.255;
  option routers 10.0.0.1, 10.0.0.2;
  default-lease-time 43200;
  min-lease-time 43199;
  max-lease-time 43201;
  option domain-name-servers 10.0.0.1, 8.8.8.8;
}
`
      var output = tpl.generateSubnet(config)
      expect(output).to.equal(expected_output)
    })
  })

})
