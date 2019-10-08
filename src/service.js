'use strict'

var service = 'isc-dhcp-server'
var {spawn} = require('child_process')

exports._sendCommand = (action) => {
  return new Promise((resolve, reject) => {
    var cmd = spawn('systemctl', [action, service]);
    cmd.on('close', (code) => {
      if (code == 0)
        resolve()
      else
        reject('Unable to ' + action + ' DHCP server')
    });
  })
}

exports.start = () => exports._sendCommand('start')
exports.restart = () => exports._sendCommand('restart')
exports.stop = () => exports._sendCommand('stop')


