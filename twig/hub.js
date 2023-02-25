const Hyperswarm = require('hyperswarm')
const Corestore = require("corestore")
const ram = require("random-access-memory")

async function runServer(){
  const corestore = new Corestore(ram)
  await corestore.ready()

  const core = corestore.get({name: "my core"})
  // const core2 = corestore.get({name: "my core2"})
  
  await core.ready()

  setInterval(async () => {
    await core.append(Buffer.from('I am a block of data'))
  }, 1000)
  
  // Replicate the corestore
  const swarm = new Hyperswarm()
  swarm.on('connection', socket => corestore.replicate(socket))
  
  // The corestore can replicate all the cores it contains
  // when connected with a peer who knows their key.
  // However, the peers first need to be connected.
  // In this case we do this by joining the swarm on the 
  // keys we host, so the client can find us
  swarm.join(core.discoveryKey, { server: true, client: false })

  // Note that for this demo, it actually suffices to join 
  // the swarm only on the first key, as once the client 
  // connected on the first core, the server can also share
  // the second core with the client.
  // But for generality's sake, we're joining on both
  // swarm.join(core2.discoveryKey, { server: true, client: false })

  // await swarm.flush()

  console.log('Serving core1: ', core.key.toString('hex'))    
  // console.log('Serving core2: ', core2.key.toString('hex'))  

  core.createReadStream({live: true}).on('data', (d) => {
    console.log(d.toString())
  })
}

runServer()