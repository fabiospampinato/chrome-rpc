# Chrome RPC

A simple RPC mechanism for Chrome extensions.

Because communication between content scripts and the background worker is more painful than it needs to be.

## Install

```sh
npm install chrome-rpc
```

## Usage

First of all we should probably define some standalone procedures, so that we can later infer their types:

```ts
// procedures.ts
const Procedures = {
  sum: ( a, b ) => a + b,
  other: async foo => {},
  ...
};
export default Procedures;
```

Then we need to register these as the available procedures in the background worker:

```ts
// worker.ts
import backend from 'chrome-rpc/backend';

backend ({
  channel: 'my_channel', // optional arbitrary channel name
  procedures,
});
```

Lastly we need to create a proxy object through which we can call these procedures from content scripts:

```ts
// content.ts
import frontend from 'chrome-rpc/frontend';
import type Procedures from './procedures';

const rpc = frontend<typeof Procedures>({
  channel: 'my_channel' // must match the channel name used in the worker
});

const result = await rpc.sum ( 1, 2 ); // => 3
```

## License

MIT © Fabio Spampinato
