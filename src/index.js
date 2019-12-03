'use strict'

var validate = require('./validate_config.js')
var service = require('./service.js')
var template = require('./template.js')
var writer = require('./writer.js')

class Server {
  constructor(config) {
    this.config = config
  }
  validate() {
    var config = Array.isArray(this.config)? this.config : [this.config]
    return Promise.all(config.map(c => {
      var iface = c.interface
      return validate.validateConfig(c).catch(e => {
        var error = `Configuration error for interface ${iface}: ${e.toString()}`
        return Promise.reject(error)
      })
    }))
      .then(configs => {
        return validate.validateAll(configs).then(() => configs)
      })
  }
  prestart() {
    var config = this.config
    return this.validate(config)
      .then(cfg => {
        return Promise.all([
          writer.iscDefaultConfig(cfg),
          writer.dhcpdConfig(cfg)
        ])
      })
  }
  start() {
    return this.prestart()
      .then(() => {
        return service.start()
      })
  }
  restart() {
    return this.prestart()
      .then(() => {
        return service.restart()
      })
  }
  stop() {
    return service.stop()
  }
}

exports.createServer = (config) => {
  return new Server(config)
}

