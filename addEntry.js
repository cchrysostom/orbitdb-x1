'use strict'

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

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
  const db = await orbitdb.keyvalue('first-cwcdb')
  await db.put('name', 'Hello, Chris!!')
  console.log('Added new entry')
})