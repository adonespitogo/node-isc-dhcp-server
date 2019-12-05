'use strict'

var is_ip = require('is-ip')
var { Netmask } = require('netmask')

exports.validateConfig = (config) => {
  return new Promise((resolve, reject) => {
    var required_opts = [
      'interface',
      'network',
      'range',
      'netmask',
      'dns',
      'router',
      'broadcast'
    ]

    required_opts.forEach(k => {
      if (!config[k]) {
        throw('Missing required option: ' + k)
      }
    })

    if (!Array.isArray(config.range))
      return reject('DHCP ip pool range must be array')

    if (!Array.isArray(config.router) && typeof config.router != 'string')
      return reject('router option must be of type string or array')

    if (!Array.isArray(config.dns) && typeof config.dns != 'string')
      return reject('dns option must be of type string or array')

    if (typeof config.router == 'string')
      config.router = [config.router]

    if (typeof config.dns == 'string')
      config.dns = [config.dns]

    if (!config.static)
      config.static = []

    if (!Array.isArray(config.static))
      return reject('static option must be of type array')

    if (!is_ip(config.range[0]) || !is_ip(config.range[1]))
      return reject('Invalid DHCP pool range')

    if (!is_ip(config.network))
      return reject('Network must be a valid IP')

    if (!is_ip(config.netmask))
      return reject('Netmask must be a valid IP')

    if (!is_ip(config.broadcast))
      return reject('Broadcast address must be a valid IP')

    var block = new Netmask(`${config.range[0]}/${config.netmask}`)

    if (!block.contains(config.range[1]))
      return reject('Invalid DHCP pool range')

    config.router.forEach(r => {
      if (!is_ip(r))
        throw('Gateway must be a valid IP')
    })

    config.dns.forEach(r => {
      if (!is_ip(r))
        throw('DNS must be valid IP(s)')
    })

    resolve(config)

  })
}

exports.validateAll = (configs) => {
  return new Promise((resolve, reject) => {

    configs.forEach(c => {
      var block = new Netmask(`${c.range[0]}/${c.netmask}`)
      configs.forEach(cc => {
        if (cc.interface != c.interface) {
          var ip = cc.range[0] + '/' + cc.netmask
          if (block.contains(ip))
            reject('Network configuration conflict/overlapping')
        }
      })
    })

    resolve()

  })
}
