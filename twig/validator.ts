import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import { registerValidator } from './generated/Twig'
import { from } from 'rxjs';

const Corestore = require("corestore")
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')

async function main() {

    const corestore = new Corestore(ram, {valueEncoding: 'json'})

    const shares = corestore.get({
        key: Buffer.from(Buffer.from(process.argv[2], 'hex')),
        valueEncoding: "utf-8"
      })

    await Fluence.start({
        connectTo: krasnodar[0]
    })

    const swarm = new Hyperswarm()
    swarm.on('connection', (socket: any) => shares.replicate(socket))
    console.log("connected: ", Fluence.getStatus().peerId)

    await shares.ready()
    swarm.join(shares.discoveryKey, { server: false, client: true })

    registerValidator({
        read: (address) => {
            return { 
                sig_share: { 
                    sig_version: '',
                    share: '',
                    address: ''
                },
                status: {
                    error: "n/a", 
                    success: true
                }
            }
        }
    })

    from(
        shares
        .createReadStream({live: true}))
        .subscribe((val: any) => console.log(val.toString())
    )
}

main()