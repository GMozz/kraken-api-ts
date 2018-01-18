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
