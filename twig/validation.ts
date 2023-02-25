import {ethers} from 'ethers'

const serverPrivateKey = ""

// remix account #0. Address: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
var wallet = new ethers.Wallet(serverPrivateKey);   

console.log("Wallet Address: " + wallet.address);    

async function SignData() {        

    var packedAddress = ethers.utils.solidityPack(["address"], [wallet.address]);
    var sig = await wallet.signMessage(packedAddress);

    console.log("Sig1 " + sig);

    console.log("Sig1 Valid? " + (ethers.utils.verifyMessage(packedAddress, sig) == wallet.address));

}

SignData();

// async function main() {
//   const walletEOA = new ethers.Wallet(serverPrivateKey, provider)
//   const wallet = (await Wallet.singleOwner(walletEOA)).connect(provider, relayer)
//   // The sequence utils `isValidMessageSignature` method can validate signatures
//   // from any kind of wallet (ie. EOA or Smart Wallet) which includes Metamask, Coinbase,
//   // and Sequence.
//   const message = 'Hi, please sign this message'

//   // const signer = wallet.getSigner()
//   const signature = await wallet.signMessage(message)

//   const signers = await wallet.getSigners()
//   const address= signers[0]

//   const isValid = await sequence.utils.isValidMessageSignature(
//     address,
//     message,
//     signature,
//     provider,
//     137 // optional, as it will use the chain id from the provider
//   )

//   console.log(isValid)
// }

// main()

// cultivate a life / question where there is a positive feedback between 
// technical challenges (x) and available time for joyful adventure (y) 
// creating a net error from y - x

