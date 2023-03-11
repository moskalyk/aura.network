import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import {ethers} from 'ethers'

import { registerValidator } from './generated/Twig'
import { from } from 'rxjs';

const Corestore = require("corestore")
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')
let fooled = 0

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
        read: async (address: string) => {
            console.log('reading')
            let share = ''

            // run a validation check on the signatures
            const readShares = shares.createReadStream()

            for await (let share of readShares){
                console.log(share)
                if(ethers.utils.verifyMessage(share.sig.address, share.sig.sig) == '0xbCDCC8D0DF0f459f034A7fbD0A6ce672AF0f0953'){
                    console.log('checkouts')
                    if(share.sig.address == address) share = share.sig.share
                }else {
                    fooled = 1;
                    return {
                        sig_share: { 
                            sig_version: 'n/a',
                            share: 'n/a',
                            address: 'n/a'
                        },
                        status: {
                            error: "STATUS(1): signature compromised", 
                            success: false
                        }
                    }
                }
            }
            return { 
                sig_share: { 
                    sig_version: 'ecdsa',
                    share: share,
                    address: address
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