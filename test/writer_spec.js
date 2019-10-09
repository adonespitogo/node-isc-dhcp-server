
var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')
var fs = {
  writeFile: sinon.fake((p, str, cb) => {
    process.nextTick(() => cb())
  })
}
var dhcpd_conf = 'some dhcpd.conf content'
var isc_default = 'some isc default content'
var template = {
  generateConfig: sinon.fake(() => dhcpd_conf),
  iscDefaultConfig: sinon.fake(() => isc_default)
}
var writer = proxyquire('../src/writer.js', {
  fs,
  './template.js': template
})

describe('Testing writer.js', () => {

  it('should write to /etc/default/isc-dhcp-server', () => {
    var config = 'my fake config'
    var p = '/etc/default/isc-dhcp-server'
    return writer.iscDefaultConfig(config)
      .then(() => {
        sinon.assert.calledWithExactly(template.iscDefaultConfig, config)
        expect(fs.writeFile.lastCall.args[0]).to.equal(p)
        expect(fs.writeFile.lastCall.args[1]).to.equal(isc_default)
      })
  })

  it('should write to /etc/dhcp/dhcpd.conf', () => {
    var config = 'my fake config'
    var p = '/etc/dhcp/dhcpd.conf'
    return writer.dhcpdConfig(config)
      .then(() => {
        sinon.assert.calledWithExactly(template.generateConfig, config)
        expect(fs.writeFile.lastCall.args[0]).to.equal(p)
        expect(fs.writeFile.lastCall.args[1]).to.equal(dhcpd_conf)
      })
  })

})
