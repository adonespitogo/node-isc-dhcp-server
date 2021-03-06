
isc-dhcp-server [![Build Status](https://travis-ci.com/adonespitogo/node-isc-dhcp-server.svg?branch=master)](https://travis-ci.com/adonespitogo/node-isc-dhcp-server)
---

NodeJS pagckage for managing [isc-dhcp-server](https://wiki.debian.org/DHCP_Server).

NOTE: For now, only basic options can be configured. Please feel free to add more by sendign PR :)

Installation
---

`npm i --save isc-dhcp-server`

Simple Usage
---

```js
var dhcp = require('isc-dhcp-server');

var s = dhcp.createServer({
  interface: 'eth0',
  range: [
    "192.168.3.10", "192.168.3.99"
  ],
  static: [
    {
      hostname: 'host1',
      mac_address: 'xx:xx:xx:xx:xx:xx',
      ip_address: '192.168.3.2'
    }
  ],
  network: '192.168.3.0',
  netmask: '255.255.255.0',
  router: '192.168.3.1',        // can be string or array
  dns: ["8.8.8.8", "8.8.4.4"],  // can be string or array
  broadcast: '192.168.3.255',
  on_commit: `
    //set your script here
    set ClientIP = binary-to-ascii(10, 8, ".", leased-address);
    execute("/usr/bin/curl", concat("http://localhost/check-ip?ip=", ClientIP));
  `
});

s.start().then(() => {
  console.log('server started')
}).catch(e => {
  console.log('Error: ', e)
})
```

Multiple Interfaces and Subnets
---

```js
var dhcp = require('isc-dhcp-server');

var subnet1 = {
  interface: 'eth0',
  range: [
    "192.168.3.10", "192.168.3.99"
  ],
  static: [
    {
      hostname: 'host1',
      mac_address: 'xx:xx:xx:xx:xx:xx',
      ip_address: '192.168.3.2'
    }
  ],
  network: '192.168.3.0',
  netmask: '255.255.255.0',
  router: '192.168.3.1',        // can be string or array
  dns: ["8.8.8.8", "8.8.4.4"],  // can be string or array
  broadcast: '192.168.3.255'
}

var subnet2 = {
  interface: 'eth1',
  range: [
    "192.168.4.10", "192.168.4.99"
  ],
  static: [
    {
      hostname: 'host1',
      mac_address: 'xx:xx:xx:xx:xx:xx',
      ip_address: '192.168.4.2'
    }
  ],
  network: '192.168.4.0',
  netmask: '255.255.255.0',
  router: '192.168.4.1',        // can be string or array
  dns: ["8.8.8.8", "8.8.4.4"],  // can be string or array
  broadcast: '192.168.4.255'
}

var s = dhcp.createServer([subnet1, subnet2]);

s.start().then(() => {
  console.log('server started')
}).catch(e => {
  console.log('Error: ', e)
})
```


API
---

***dhcp.createServer(options | [options])***
  - options - can be an object or array of option
  - range (array) - start/end of ip lease loop
  - static (array) - staic mappings of mac/ip reservations
  - netmask (string) - network mask
  - router(array) - ip/s of gateway(s)
  - dns(array) - dns servers
  - broadcast(string) - broadcast address


***server.validate()***
  - (returns a promise) validate configuration (also called before `server.start()` and `server.restart()`)

***server.start()***
  - (returns a promise) start the server
  
***server.stop()***
  - (returns a promise) stop the server

***server.restart()***
  - (returns a promise) restart the server


The server is started/stopped using `systemctl start/stop isc-dhcp-server` command.

License
---

MIT

