import { KrakenClient } from "./krakenClient";
import { OrderInfo, Order } from "./dataModels/orderInfo";

export class KrakenClientWrapper {

    private _krakenClient: KrakenClient;

    constructor(krakenClient: KrakenClient) {
        this._krakenClient = krakenClient;
    }

    public async getOpenOrders(trades?: boolean, userref?: string): Promise<OrderInfo> {
        const params: any = {};
        if (trades) {
            params.trades = trades;
        }
        if (userref) {
            params.userref = userref;
        }

        //Add a reviver to convert the dictionary into an array of orders
        this._krakenClient.setReviver(this.openOrderReviver);
        const promise = await this._krakenClient.api("OpenOrders", params);
        this._krakenClient.setReviver(undefined);

        return promise;
    }

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

    public async getClosedOrders(trades?: boolean, userref?: string, start?: number, end?: number, ofs?: number, closetime?: string): Promise<OrderInfo> {
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
        this._krakenClient.setReviver(this.closedOrderReviver);
        const promise = await this._krakenClient.api("ClosedOrders", params);
        this._krakenClient.setReviver(undefined);

        return promise;
    }

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
