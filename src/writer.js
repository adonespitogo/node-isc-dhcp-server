//writes config files to its destination

var util = require('util')
var fs = require('fs')
var writeFile = util.promisify(fs.writeFile)
var p = '/etc/default/isc-dhcp-server'
var p2 = '/etc/dhcp/dhcpd.conf'

exports.iscDefaultConfig = (str) => {
  return writeFile(p, str)
}

exports.dhcpdConfig = (str) => {
  return writeFile(p2, str)
}



