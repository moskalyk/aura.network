import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import { createSignature, registerHyperNode } from './generated/Twig'

async function main(HUB_PEER_ID: any, VALIDATOR_PEER_ID: any) {

    await Fluence.start({
        connectTo: krasnodar[0]
    })
    
    console.log("connected: ", Fluence.getStatus().peerId)

    // thank shamir
    const res0 = await createSignature(HUB_PEER_ID, {sig_version: 'ecdsa', share: '', address: ''})
    console.log(res0)

    // const res1 = await registerHyperNode(HUB_PEER_ID, VALIDATOR_PEER_ID)
    // console.log(res1)
}

main('12D3KooWEdR81bzioLHUJnNvUtdxHRCCw6qnfJ2iWkjpfmUgsWyG', '')