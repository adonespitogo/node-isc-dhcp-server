//writes config files to its destination

var util = require('util')
var fs = require('fs')
var template = require('./template.js')
var writeFile = util.promisify(fs.writeFile)
var p = '/etc/default/isc-dhcp-server'
var p2 = '/etc/dhcp/dhcpd.conf'

exports.iscDefaultConfig = (config) => {
  var str = template.iscDefaultConfig(config)
  return writeFile(p, str)
}

exports.dhcpdConfig = (config) => {
  var str = template.generateConfig(config)
  return writeFile(p2, str)
}



