'use strict'

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

console.log("Starting...")

const ipfs = new IPFS({
    repo: './orbitdb/examples/ipfs',
    start: true,
    EXPERIMENTAL: {
        pubsub: true,
    },
})

ipfs.on('error', (err) => console.error(err))

ipfs.on('ready', async () => {
    const orbitdb = await OrbitDB.createInstance(ipfs)
})

