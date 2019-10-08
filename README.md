
node-isc-dhcp-server
---

NodeJS pagckage for managing [isc-dhcp-server](https://wiki.debian.org/DHCP_Server).

Usage
---

```js
var dhcp = require('dhcp');

var s = dhcp.createServer({
  // System settings
  range: [
    "192.168.3.10", "192.168.3.99"
  ],
  static: {
    "11:22:33:44:55:66": "192.168.3.100"
  },

  // Option settings
  netmask: '255.255.255.0',
  router: [
    '192.168.0.1'
  ],
  dns: ["8.8.8.8", "8.8.4.4"],
  broadcast: '192.168.0.255',
  server: '192.168.0.1', // This is us
});

s.start().then(() => {
  console.log('server started')
}).catch(e => {
  console.log('Error: ', e)
})
```

API
---

#createServer(options)
  - range (array) - start/end of ip lease loop
  - static (object) - staic mappings of mac/ip reservations
  - netmask (string) - network mask
  - router(array) - ip/s of gateway(s)
  - dns(array) - dns servers
  - broadcast(string) - broadcast address

#start()
  - (returns a promise) start the server
  
#stop()
  - (returns a promise) stop the server

The server is started/stopped using `systemctl start/stop isc-dhcp-server` command.

License
---

MIT
