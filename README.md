# Node Kraken TS

NodeJS Client Library for the Kraken (kraken.com) API written in Typescript

This is an asynchronous node js client for the kraken.com API. It exposes all the API methods found here: https://www.kraken.com/help/api through the ```api``` method:

Example Usage:

```typescript
import { KrakenClient } from "./krakenClient";

const key          = '...'; // API Key
const secret       = '...'; // API Private Key
const kraken       = new KrakenClient(key, secret);

kraken.api("Time")
	.then((result) => {
		console.log(`Result: ${JSON.stringify(result, null, 2)}`);
	})
	.catch((error) => {
		console.log(error.message);
	});

kraken.api("Balance")
	.then((result) => {
		console.log(`Result: ${JSON.stringify(result, null, 2)}`);
	})
	.catch((error) => {
		console.log(error.message);
	});
```

Credit:

This is heavily inspired (but mostly shamelessly copied) by a NodeJS Client written in JavaScript: https://github.com/nothingisdead/npm-kraken-api