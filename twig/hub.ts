import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import { registerTwig } from './generated/Twig'

const hypercore = require('hypercore')

const peers = new hypercore('./peers', {valueEncoding: 'json'})
const shares = new hypercore('./shares', {valueEncoding: 'json'})

async function main() {

    await Fluence.start({
        connectTo: krasnodar[0]
    })
    
    console.log("connected: ",Fluence.getStatus().peerId)

    registerTwig({
        register_hyper_node: (string) => {
            peers.append(string)
            console.log(peers.get(peers.length - 1))
            return true
        },
        append_sig: (sig: any) => {
            shares.append({sig: sig})
            console.log(shares.get(shares.length - 1))
            return true
        },
        get_random_hyper_node: (ttl) => {
            return peers.get(ttl % peers.length)
        }
    })
}

main()