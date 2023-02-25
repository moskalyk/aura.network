import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'

import { registerValidator } from './generated/Twig'

async function main() {

    await Fluence.start({
        connectTo: krasnodar[0]
    })

    console.log("connected: ", Fluence.getStatus().peerId)

    registerValidator({
        read: (address) => {
            return { 
                sig_share: { 
                    sig: '',
                    share: '',
                    address: ''
                },
                error: "n/a", 
                success: true
            }
        }
    })
}

main()