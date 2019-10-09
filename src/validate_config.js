
module.exports = (config) => {
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

    var rejected = false
    required_opts.forEach(k => {
      if (!config[k]) {
        rejected = true
        return reject('Missing required option: ' + k)
      }
    })

    if (rejected) return

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

    resolve(config)

  })
}
