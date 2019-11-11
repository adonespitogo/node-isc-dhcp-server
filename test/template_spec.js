'use strict'

var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')
var tpl = require('../src/template.js')
var default_tpl = require('../src/templates/default.js')

describe('config template generator', () => {

  describe('generateStatic() method', () => {
    it('should generate empty string if config.static is not defined', () => {
      var expected_output = ``
      var output = tpl.generateStatic()
      expect(output).to.equal(expected_output)
    })
    it('should generate empty string if config.static is empty', () => {
      var expected_output = ``
      var output = tpl.generateStatic([])
      expect(output).to.equal(expected_output)
    })
    it('should generate static ip/mac config portion', () => {
      var hosts = [
        {hostname: 'host1', ip_address: '10.0.0.1', mac_address: '111111'},
        {hostname: 'host2', ip_address: '10.0.0.2', mac_address: '222222'}
      ]

      var expected_output = `
host host1 {
  hardware ethernet 111111;
  fixed-address 10.0.0.1;
}

host host2 {
  hardware ethernet 222222;
  fixed-address 10.0.0.2;
}
`
      var output = tpl.generateStatic(hosts)
      expect(output).to.equal(expected_output)
    })
  })

  describe('generateSubnet() method', () => {
    it('should generate the subnet portion of config without static mappings', () => {
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

    it('should generate the subnet portion of config with static mappings', () => {
      var static_entries_mock = 'STATIC ENTRIES MOCK'
      var generate_static_stub = sinon.stub(tpl, 'generateStatic').returns(static_entries_mock)
      var config = {
        static: [{
          hostname: 'host1',
          ip_address: '10.0.0.1',
          mac_address: '111111'
        }],
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
${static_entries_mock}
}
`
      var output = tpl.generateSubnet(config)
      expect(output.trim()).to.equal(expected_output.trim())
      sinon.assert.calledWithExactly(generate_static_stub, config.static)
      generate_static_stub.restore()
    })
  })

  describe('generateConfig() method', () => {
    it('should generate config for single subnet', () => {
      var subnet_result_mock = 'SUBNET RESULT MOCK'
      var generate_subnet_stub = sinon.stub(tpl, 'generateSubnet').returns(subnet_result_mock)
      var config = {interface: 'eth0'}

      var expected_output = default_tpl + `
${subnet_result_mock}
`
      var output = tpl.generateConfig(config)
      expect(output).to.equal(expected_output.trim())
      generate_subnet_stub.restore()
    })
    it('should generate config for multiple subnet', () => {
      var subnet_result_mock = 'SUBNET RESULT MOCK'
      var generate_subnet_stub = sinon.stub(tpl, 'generateSubnet').returns(subnet_result_mock)
      var config = [{interface: 'eth0'}, {interface: 'wlan0'}]

      var expected_output = default_tpl + `
${subnet_result_mock}
${subnet_result_mock}
`
      var output = tpl.generateConfig(config)
      expect(output).to.equal(expected_output.trim())
      generate_subnet_stub.restore()
    })
  })

  describe('iscDefaultConfig() method', () => {
    it('should generate config for /etc/default/isc-dhcp-server for multiple interfaces', () => {
      var config = [{interface: 'eth0'}, {interface: 'wlan0'}]
      var expected_output = `
INTERFACES="eth0 wlan0"
INTERFACESv4="eth0 wlan0"
`
      var output = tpl.iscDefaultConfig(config)
      expect(output).to.equal(expected_output)
    })
    it('should generate config for /etc/default/isc-dhcp-server for single interface', () => {
      var config = {interface: 'wlan0'}
      var expected_output = `
INTERFACES="wlan0"
INTERFACESv4="wlan0"
`
      var output = tpl.iscDefaultConfig(config)
      expect(output).to.equal(expected_output)
    })
  })

})

