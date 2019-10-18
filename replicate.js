'use strict'

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

console.log("Starting first ipfs")
// Create the first peer
const ipfs1 = new IPFS({ repo: './ipfs1',
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
})
ipfs1.on('ready', async () => {
  // Create the database
  const orbitdb1 = await OrbitDB.createInstance(ipfs1, { directory: './orbitdb1' })
  const db1 = await orbitdb1.log('events')

  // Create the second peer
  console.log("Starting second ipfs.")
  const ipfs2 = new IPFS({
    repo: './ipfs2',
    start: true,
    EXPERIMENTAL: {
      pubsub: true,
    },
  })
  ipfs2.on('ready', async () => {
    console.log("ipfs2 ready event")
    // Open the first database for the second peer,
    // ie. replicate the database
    const orbitdb2 = await OrbitDB.createInstance(ipfs2, { directory: './orbitdb2' })
    const db2 = await orbitdb2.log(db1.address.toString())

    // When the second database replicated new heads, query the database
    db2.events.on('replicated', () => {
      console.log('db2 replicated')
      const result = db2.iterator({ limit: -1 }).collect().map(e => e.payload.value)
      console.log(result.join('\n'))
    })

    // Start adding entries to the first database
    setInterval(async () => {
      await db1.add({ time: new Date().getTime() })
    }, 1000)
  })
})