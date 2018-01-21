import { KrakenClient } from "./krakenClient";
import { KrakenClientWrapper } from "./krakenClientWrapper";
import { OrderInfo } from "./dataModels/orderInfo";

const key           = '...'; // API Key
const secret        = '...'; // API Private Key
const kraken        = new KrakenClient(key, secret);
const krakenWrapper = new KrakenClientWrapper(kraken);

/*
 * You can use the KrakenClient to make calls directly,
 * for all the API calls that are supported by Kraken.
 * 
 * Public API calls: "Time", "Assets", "AssetPairs", "Ticker", "Depth", "Trades", "Spread", "OHLC"
 * 
 * Private API calls: "Balance", "TradeBalance", "OpenOrders", "ClosedOrders", "QueryOrders",
 * "TradesHistory", "QueryTrades", "OpenPositions", "Ledgers", "QueryLedgers", "TradeVolume",
 * "AddOrder", "CancelOrder", "DepositMethods", "DepositAddresses", "DepositStatus", "WithdrawInfo",
 * "Withdraw", "WithdrawStatus", "WithdrawCancel"
 */
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

/*
 * Or you can use the KrakenClientWrapper, which will return statically typed objects.
 * But unfortunately the KrakenClientWrapper is not yet complete and currently only supports:
 * 
 * "getOpenOrders()"
 * "getClosedOrders()"
 * 
 * It is important to know that you can not make multiple private calls at the same time,
 * each private call must have a nonce which is always unique and higher than the last one.
 * Therefor you must chain them like the example below. This also applies to the KrakenClient
 * without the wrapper.
 */
krakenWrapper.getOpenOrders()
	.then((result: OrderInfo) => {
		console.log(`getOpenOrders(): ${JSON.stringify(result, null, 2)}`);
		return krakenWrapper.getClosedOrders()
	})
	.then((result: OrderInfo) => {
		console.log(`getClosedOrders(): ${JSON.stringify(result, null, 2)}`);
	})
	.catch((error) => {
		console.log(error.message);
	});
