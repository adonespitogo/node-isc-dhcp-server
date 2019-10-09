'use strict'

var validate = require('./validate_config.js')
var service = require('./service.js')
var template = require('./template.js')
var writer = require('./writer.js')

class Server {
  constructor(config) {
    this.config = config
  }
  prestart() {
    var config = this.config
    return validate(config)
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

