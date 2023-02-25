const Corestore = require('corestore')
const Hyperswarm = require('hyperswarm')

const store = new Corestore('./data-leaf', {valueEncoding: 'json'})
const core1 = store.get({ name: 'my-core-1' })

async function main() {
	await core1.ready()
	const swarm = new Hyperswarm()
	swarm.join(core1.discoveryKey, {server: true, client: false })
	console.log('-----')
	console.log(core1.discoveryKey)
	console.log(core1.discoveryKey.toString('hex'))
	console.log('Core:', core1.key.toString('hex'))
		
	swarm.on('connection', conn => {
		console.log('connection')
		core1.replicate(conn)
	})

	setInterval(async () => {
		await core1.append(Buffer.from('I am a block of data'))
	}, 1000)

	core1.createReadStream({live: true}).on('data', (d) => {
		console.log(d.toString())
	})
}

main()