'use strict'

var subnet_tpl = require('./templates/subnet.js')
var static_tpl = require('./templates/static.js')

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

  return subnet_tpl
    .replace('[RANGE_START]', config.range[0])
    .replace('[RANGE_END]', config.range[1])
    .replace('[NETWORK_ADDRESS]', config.network)
    .replace('[NETMASK]', config.netmask)
    .replace('[BROADCAST_ADDRESS]', config.broadcast)
    .replace('[OPTION_ROUTERS]', options_router)
    .replace('[OPTION_DNS]', options_dns)
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
