# nostr-rebroadcast

This tool allows you to take events from one relay and publish them to another

## Pre-requisites

You must have node.js (18) and npm installed.

## Steps

```
git clone https://github.com/leesalminen/nostr-rebroadcast.git
cd nostr-rebroadcast
npm install
```

Open `index.js` with your favorite text editor and change to your values as needed.

- YOUR_HEX_ENCODED_PUBLIC_KEY_HERE
- TO_RELAY_URL

Note, you can also change the values of the `relayFromUrls` array to match your current relay list as desired.

Save the changes to the file then run

```
node index.js
```
