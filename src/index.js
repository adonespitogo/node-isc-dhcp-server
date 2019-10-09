'use strict'

var service = require('./service.js')
var template = require('./template.js')
var writer = require('./writer.js')

class Server {
  constructor(config) {}
  start() {}
  stop() {}
  restart() {}
}

exports.Server = Server

exports.createServer = (config) => {

  return new Server(config)

}
