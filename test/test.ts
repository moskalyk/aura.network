import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import { createSignature, registerHyperNode, readSignature } from '../twig/generated/Twig'

async function main(HUB_PEER_ID: any, VALIDATOR_PEER_ID: any) {

    await Fluence.start({
        connectTo: krasnodar[0]
    })
    
    console.log("connected: ", Fluence.getStatus().peerId)

    // thank shamir
    const res0 = await createSignature(HUB_PEER_ID, {sig_version: 'ecdsa', share: 'joy', address: '0x'})
    console.log(res0)

    const res1 = await registerHyperNode(HUB_PEER_ID, VALIDATOR_PEER_ID, {ttl: 10000})
    console.log(res1)

    const res2 = await readSignature(krasnodar[0].peerId, HUB_PEER_ID, '0x', {ttl: 13000})
    console.log(res2)

    // register multiple hyper nodes
    // test a bad signature in the code
    // setTimeout(async () => {
    //     const res0 = await createSignature(HUB_PEER_ID, {sig_version: 'ecdsa', share: '', address: ''})
    // }, 7000)
}

main('12D3KooWDywFZp9btB5ujqKii5TXB6ohhr5DJBxDYFaHRESCAhmX', '12D3KooWLk4qaqxDYBfB62tdZ6Bx1Fk5TcLcdTwzDeNmiShgWaZq')