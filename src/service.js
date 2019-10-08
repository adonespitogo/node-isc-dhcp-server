'use strict'

var service = 'isc-dhcp-server'
var {spawn} = require('child_process')
var actions = ['start', 'stop', 'restart']

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

actions.forEach(a => {
  exports[a] = () => exports._sendCommand(a)
})



