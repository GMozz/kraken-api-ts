export interface OrderInfo {
    error: string[];
    result: Orders;
  }
  
export interface Orders {
    open?: Order[];
    closed?: Order[];
    
    //Only available for closed orders
    count?: number;
}

export interface Order {
    refid?: any;
    userref?: number;
    status: string;
    opentm: number;
    starttm: number;
    expiretm: number;
    descr: Descr;
    vol: string;
    vol_exec: string;
    cost: string;
    fee: string;
    price: string;
    stopprice: string;
    limitprice: string;
    misc: string;
    oflags: string;
    trades?: string[];
    txid: string;
    
    //Only available for closed orders
    closetm?: number;
    reason?: string;
}

export interface Descr {
    pair: string;
    type: string;
    ordertype: string;
    price: string;
    price2: string;
    leverage: string;
    order: string;
    close?: string;
}
