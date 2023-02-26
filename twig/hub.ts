import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import {ethers} from 'ethers'

var wallet = new ethers.Wallet(""); 

import { registerTwig } from './generated/Twig'
import { from } from 'rxjs';

const Corestore = require("corestore")
const Hyperswarm = require('hyperswarm')
let fooled = 0

async function main() {

    await Fluence.start({
        connectTo: krasnodar[0]
    })

    const corestore = new Corestore('./db')
    const peers = corestore.get({name: "peers", valueEncoding: 'json'})
    const shares = corestore.get({name: "shares", valueEncoding: 'json'})
    
    // ready the barrels
    await peers.ready()
    await shares.ready()

    console.log("connected: ",Fluence.getStatus().peerId)
    console.log('hub peer', wallet.address)

    // Replicate the corestore
    const swarm = new Hyperswarm()
    swarm.on('connection', (socket: any) => corestore.replicate(socket))
    swarm.join(shares.discoveryKey, { server: true, client: false })

    registerTwig({
        append_sig: async (share_payload: any) => {
            console.log('are we fooled?')
            console.log(fooled)
            if(!fooled){
                console.log(share_payload)
                const packedPayload = ethers.utils.solidityPack(["address", "string"], [wallet.address, share_payload.share]);

                const sig = await wallet.signMessage(packedPayload);

                shares.append(
                    {
                        keeper_address: wallet.address,
                        sig_version: share_payload.sig_version, 
                        sig: sig,
                        share: share_payload.share, 
                        address: share_payload.address
                    }
                )
                
                console.log(shares.get(shares.length - 1))
                return {
                    error: "n/a", 
                    success: true
                }
            } else {
                return {
                    error: "STATUS(1): server compromised", 
                    success: false
                }
            }
        },
        register_hyper_node: async (peer_id: any) => {
            console.log(peer_id)
            const fullStream = shares.createReadStream()
            for await (const share of fullStream) {
                if(ethers.utils.verifyMessage(ethers.utils.solidityPack(["address", "string"], [share.keeper_address, share.share]), share.sig) == wallet.address){
                    console.log('checksout')
                }else {
                    fooled = 1;
                    return {
                        error: "signatures are compromised", 
                        success: false
                    }
                }
            }

            peers.append({peer_id: peer_id})
            console.log(await peers.get(peers.length - 1))
            return {
                error: "n/a", 
                success: true
            }
        },
        get_random_hyper_node: async (ttl) => {
            console.log(ttl)
            console.log(peers.length)
            console.log(await peers.get(ttl % peers.length))
            return (await peers.get(ttl % peers.length)).peer_id
        }
    })

    // peer listner
    from(
        peers
        .createReadStream({live: true})
    )
    .subscribe(
        (peer: any) => {
            console.log(peer)
        }
    )  

    // share listener
    from(
        shares
        .createReadStream({live: true})
    )
    .subscribe(
        (share: any) => {
            console.log(share)
            if(ethers.utils.verifyMessage(ethers.utils.solidityPack(["address", "string"], [share.keeper_address, share.share]), share.sig) == wallet.address){
                console.log('checksout')
            }else {
                fooled = 1;
            }
        }
    )    

    // for testing
    // setInterval(async () => {
    //     const packedPayload = ethers.utils.solidityPack(["address", "string"], [wallet.address, 'rasberry']);

    //     const sig = await wallet.signMessage(packedPayload);
        
    //     const sigShare = {
    //         keeper_address: wallet.address,
    //         sig_version: 'ecdsa', 
    //         sig: sig,
    //         share: '', 
    //         address: '0x'
    //     }
        
    //     await shares.append({sig: sigShare})
    // }, 5000)

    console.log('Serving core1: ', shares.key.toString('hex'))    
}

main()