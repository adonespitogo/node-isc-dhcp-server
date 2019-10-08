'use strict'

var subnet_tpls = require('./templates/subnet.js')

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

  return subnet_tpls
    .replace('[RANGE_START]', config.range[0])
    .replace('[RANGE_END]', config.range[1])
    .replace('[NETWORK_ADDRESS]', config.network)
    .replace('[NETMASK]', config.netmask)
    .replace('[BROADCAST_ADDRESS]', config.broadcast)
    .replace('[OPTION_ROUTERS]', options_router)
    .replace('[OPTION_DNS]', options_dns)
}
