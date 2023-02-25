const Hyperswarm = require('hyperswarm')
const Corestore = require("corestore")
const ram = require("random-access-memory")
const { once } = require("events");

const KEY1 = 'b23149a67dd4a3ecff79729423efd7a1962f27d89036ebb5544196617a85479d' // Key for core 1 (as str)
// const KEY2 = 'd99257ca6d49d479e75dcf30428c212ef8250f4a3971863eb4198106189a4d26' // Key for core 2 (as str)

async function runClient(){
  const corestore = new Corestore(ram)

  const core1 = corestore.get({
    key: Buffer.from(KEY1, "hex"),
    valueEncoding: "utf-8"
  })
  
  const swarm = new Hyperswarm()
  swarm.on('connection', socket => corestore.replicate(socket))

  await core1.ready()

  // console.log(core1.discoveryKey)
  swarm.join(core1.discoveryKey, { server: false, client: true })
  // swarm.join(core2.discoveryKey, { server: false, client: true })
  await swarm.flush()

  core1.createReadStream({live: true}).on('data', (d) => {
    console.log(d.toString())
  })
}


runClient()