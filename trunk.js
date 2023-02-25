const Corestore = require('corestore')
const Hyperswarm = require('hyperswarm')

const store = new Corestore('./data-trunk', process.argv[3], {valueEncoding: 'json'})
const core1 = store.get({ name: 'my-core-1' })

async function main() {
	await core1.ready()
	const swarm = new Hyperswarm()
	console.log(Buffer.from(process.argv[2], 'hex'))
	swarm.join(Buffer.from(process.argv[2], 'hex'), {server: false, client: true })
	console.log(core1.discoveryKey)

	console.log('Core:', core1.key.toString('hex'))
		
	swarm.on('connection', conn => {
		console.log('Connection!')
		core1.replicate(conn)
	})

	// grr
	core1.createReadStream({live: true}).on('data', (d) => {
		console.log(d.toString())
	})
}

main()