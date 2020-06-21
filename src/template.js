'use strict'

var subnet_tpl = require('./templates/subnet.js')
var static_tpl = require('./templates/static.js')
var default_tpl = require('./templates/default.js')
var oncommit_tpl = require("./templates/on_commit.js")

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
    .replace('[STATIC]', exports.generateStatic(config.static))
  return result
}

exports.generateStatic = (hosts) => {
  if (!hosts) return ''
  if (!hosts.length) return ''
  var tpl = ''
  hosts.forEach((h, i) => {
    tpl += static_tpl
      .replace('[HOSTNAME]', h.hostname)
      .replace('[MAC]', h.mac_address)
      .replace('[IP]', h.ip_address)
  })
  return tpl
}

exports.generateOnCommit = (script)=>{
  if(!script) return ''
  return oncommit_tpl.replace('[ON_COMMIT]', script)
}

exports.generateConfig = (config) => {
  config = Array.isArray(config)? config : [config]
  var result = config.reduce((fin, cfg) => {
    return fin + '\n' + exports.generateSubnet(cfg).trim() 
  }, '')

  var ret = default_tpl + `
${result.trim()}
${exports.generateOnCommit(config.on_commit)}
`
  return ret.trim()

}

exports.iscDefaultConfig = (config) => {
  var config = Array.isArray(config) ? config : [config]
  var interfaces = config.reduce((fin, current) => {
    fin += ' ' + current.interface
    return fin.trim()
  }, '')

  return `
INTERFACES="${interfaces}"
INTERFACESv4="${interfaces}"
`
}
