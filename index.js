import 'websocket-polyfill'
import pkg from 'nostr-tools'

const relayInit = pkg.relayInit
const getEventHash = pkg.getEventHash
const signEvent = pkg.signEvent

let sk = 'YOUR_HEX_ENCODED_PRIVATE_KEY_HERE'
let pk = 'YOUR_HEX_ENCODED_PUBLIC_KEY_HERE'

const relayFromUrls = [
  'wss://no.str.cr',
  'wss://paid.no.str.cr',
  'wss://nostr.fly.dev',
  'wss://relay.snort.social',
  'wss://relay.realsearch.cc',
  'wss://relay.nostrgraph.net',
  'wss://relay.minds.com/nostr/v1/ws',
  'wss://nos.lol',
  'wss://relay.current.fyi',
  'wss://puravida.nostr.land',
  'wss://nostr.milou.lol',
  'wss://eden.nostr.land',
  'wss://relay.damus.io',
  'wss://nostr.oxtr.dev',
]

const relayToUrl = 'TO_RELAY_URL'

relayFromUrls.forEach(async (relayUrl) => {
  const relayFrom = relayInit(relayUrl)
  await relayFrom.connect()

  const relayTo = relayInit(relayToUrl)
  await relayTo.connect()

  const eventsToMove = []

  relayFrom.on('connect', () => {
    console.log(`connected to ${relayFrom.url}`)
  })

  relayTo.on('connect', () => {
    console.log(`connected to ${relayTo.url}`)
  })

  const sub = relayFrom.sub([
    {
      authors: [pk],
    }
  ])
  sub.on('event', event => {
    let myEvent = {
      kind: event.kind,
      pubkey: pk,
      created_at: event.created_at,
      tags: event.tags,
      content: event.content,
    }
    myEvent.id = getEventHash(myEvent)
    myEvent.sig = signEvent(myEvent, sk)

    eventsToMove.push(myEvent)
  })
  sub.on('eose', async () => {
    sub.unsub()

    console.log(`got ${eventsToMove.length} events from ${relayFrom.url}`)

    eventsToMove.forEach(async (event, index) => {
      const pub = relayTo.publish(event)
      pub.on('ok', async () => {
        console.log(`${relayTo.url} has accepted our event from ${relayFrom.url} on ${new Date(event.created_at * 1000).toISOString()} of kind ${event.kind} and ID ${event.id}`)

        if(index == eventsToMove.length - 1) {
          await relayFrom.close()
          await relayTo.close()
        }
      })
    })
  })
})