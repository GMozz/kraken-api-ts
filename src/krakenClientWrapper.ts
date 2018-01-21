import { KrakenClient } from "./krakenClient";
import { OrderInfo, Order } from "./dataModels/orderInfo";

export class KrakenClientWrapper {

    private _krakenClient: KrakenClient;

    /**
     * Provide the wrapper with the kraken client that'll make the eventual API calls
     * @param krakenClient KrakenClient
     */
    constructor(krakenClient: KrakenClient) {
        this._krakenClient = krakenClient;
    }

    /**
     * Get the open orders. All parameters are optional, returns statically typed OrderInfo object.
     * Official API docs from Kraken: https://www.kraken.com/help/api#get-open-orders
     * @param trades boolean
     * @param userref string
     */
    public getOpenOrders(trades?: boolean, userref?: string): Promise<OrderInfo> {
        const params: any = {};
        if (trades) {
            params.trades = trades;
        }
        if (userref) {
            params.userref = userref;
        }

        //Add a reviver to convert the dictionary into an array of orders
        return this._krakenClient.api("OpenOrders", params, undefined, this.openOrderReviver);
    }

    /**
     * Kraken returns all orders as a dictionary instead of an array, this reviver converts it into an array
     * @param key string
     * @param value any
     */
    private openOrderReviver(key: string, value: any): any {
        if (key === "open") {
            const orders = new Array<Order>();
            Object.entries(value).forEach(([key, order]) => {
                order.txid = key;
                orders.push(order);
            })
            value = orders;
        }

        return value;
    }

    /**
     * Get the closed orders. All parameters are optional, returns statically typed OrderInfo object.
     * Official API docs from Kraken: https://www.kraken.com/help/api#get-closed-orders
     * @param trades boolean
     * @param userref string
     * @param start number
     * @param end number
     * @param ofs number
     * @param closetime string
     */
    public getClosedOrders(trades?: boolean, userref?: string, start?: number, end?: number, ofs?: number, closetime?: string): Promise<OrderInfo> {
        const params: any = {};
        if (trades) {
            params.trades = trades;
        }
        if (userref) {
            params.userref = userref;
        }
        if (start) {
            params.start = start;
        }
        if (end) {
            params.end = end;
        }
        if (ofs) {
            params.ofs = ofs;
        }
        if (closetime) {
            params.closetime = closetime;
        }

        //Add a reviver to convert the dictionary into an array of orders
        return this._krakenClient.api("ClosedOrders", params, undefined, this.closedOrderReviver);
    }

    /**
     * Kraken returns all orders as a dictionary instead of an array, this reviver converts it into an array
     * @param key string
     * @param value any
     */
    private closedOrderReviver(key: string, value: any): any {
        if (key === "closed") {
            const orders = new Array<Order>();
            Object.entries(value).forEach(([key, order]) => {
                order.txid = key;
                orders.push(order);
            })
            value = orders;
        }

        return value;
    }
}
