
var proxyquire = require('proxyquire')
var expect = require('chai').expect
var sinon = require('sinon')
var fs = {
  writeFile: sinon.fake((p, str, cb) => {
    process.nextTick(() => cb())
  })
}
var writer = proxyquire('../src/writer.js', {fs})

describe('Testing writer.js', () => {

  it('should write to /etc/default/isc-dhcp-server', () => {
    var content = 'settings for /etc/default/isc-dhcp-server'
    var p = '/etc/default/isc-dhcp-server'
    return writer.iscDefaultConfig(content)
      .then(() => {
        expect(fs.writeFile.lastCall.args[0]).to.equal(p)
        expect(fs.writeFile.lastCall.args[1]).to.equal(content)
      })
  })

  it('should write to /etc/dhcp/dhcpd.conf', () => {
    var content = 'settings for /etc/dhcp/dhcpd.conf'
    var p = '/etc/dhcp/dhcpd.conf'
    return writer.dhcpdConfig(content)
      .then(() => {
        expect(fs.writeFile.lastCall.args[0]).to.equal(p)
        expect(fs.writeFile.lastCall.args[1]).to.equal(content)
      })
  })

})
