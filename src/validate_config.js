
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

    required_opts.forEach(k => {
      if (!config[k])
        reject('Missing required option: ' + k)
    })

    if (!Array.isArray(config.range))
      reject('DHCP ip pool range must be array')

    if (!Array.isArray(config.router) && typeof config.router != 'string')
      reject('router option must be of type string or array')

    if (!Array.isArray(config.dns) && typeof config.dns != 'string')
      reject('dns option must be of type string or array')

    if (typeof config.router == 'string')
      config.router = [config.router]

    if (typeof config.dns == 'string')
      config.dns = [config.dns]

    resolve(config)

  })
}
