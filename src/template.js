'use strict'

var subnet_tpl = require('./templates/subnet.js')
var static_tpl = require('./templates/static.js')
var default_tpl = require('./templates/default.js')

exports.generateSubnet = (config) => {

  var options_router = 'option routers '
  config.router.forEach((r, i) => {
    options_router += (i > 0 ? ', ': '') + r
  })
  options_router += ';'

  var options_dns = 'option domain-name-servers '
  config.dns.forEach((r, i) => {
    options_dns += (i > 0 ? ', ': '') + r
  })
  options_dns += ';'

  var result = subnet_tpl
    .replace('[RANGE_START]', config.range[0])
    .replace('[RANGE_END]', config.range[1])
    .replace('[NETWORK_ADDRESS]', config.network)
    .replace('[NETMASK]', config.netmask)
    .replace('[BROADCAST_ADDRESS]', config.broadcast)
    .replace('[OPTION_ROUTERS]', options_router)
    .replace('[OPTION_DNS]', options_dns)
  return result
}

exports.generateStatic = (hosts) => {
  var tpl = ''
  hosts.forEach((h, i) => {
    tpl += static_tpl
      .replace('[HOSTNAME]', h.hostname)
      .replace('[MAC]', h.mac_address)
      .replace('[IP]', h.ip_address)
  })
  return tpl
}

exports.generateConfig = (config) => {
  var result = exports.generateSubnet(config)
  var static_tpl = exports.generateStatic(config.static)
  result = result.replace('[STATIC]', static_tpl)
  return default_tpl + result
}

exports.iscDefaultConfig = (config) => {
  return `
INTERFACES="${config.interface}"
INTERFACESv4="${config.interface}"
`
}
