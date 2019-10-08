module.exports = `
subnet [NETWORK_ADDRESS] netmask [NETMASK] {
  range [RANGE_START] [RANGE_END];
  option broadcast-address [BROADCAST_ADDRESS];
  [OPTION_ROUTERS]
  default-lease-time 43200;
  min-lease-time 43199;
  max-lease-time 43201;
  [OPTION_DNS]
}
`
