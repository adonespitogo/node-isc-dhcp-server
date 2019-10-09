
var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')

var template = require('../src/template.js')
var service = require('../src/service.js')
var writer = {
  iscDefaultConfig: sinon.fake.resolves(),
  dhcpdConfig: sinon.fake.resolves()
}

var dhcp;

describe('Testing isc-dhcp-server package', () => {

  beforeEach(() => {
    dhcp = proxyquire('../src/index.js', {
      './service.js': service,
      './template.js': template,
      './writer.js': writer
    })
  })

  describe('createServer() method', () => {
    it('should create server instance', () => {
      var config = {}
      var s = dhcp.createServer(config)
      expect(s).to.be.instanceOf(dhcp.Server)
    })
  })

})

