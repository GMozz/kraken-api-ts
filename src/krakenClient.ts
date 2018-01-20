import * as crypto from "crypto";
import * as qs from "qs";
import * as got from "got";

export class KrakenClient {

  //Public method names
  public static publicMethods: string[] = ["Time", "Assets", "AssetPairs", "Ticker", "Depth", "Trades", "Spread", "OHLC"];
  //Private method names
  public static privateMethods: string[] = ["Balance", "TradeBalance", "OpenOrders", "ClosedOrders", "QueryOrders", "TradesHistory", "QueryTrades", "OpenPositions", "Ledgers", "QueryLedgers", "TradeVolume", "AddOrder", "CancelOrder", "DepositMethods", "DepositAddresses", "DepositStatus", "WithdrawInfo", "Withdraw", "WithdrawStatus", "WithdrawCancel"];

  //Default config
  private static url: string = "https://api.kraken.com";
  private static version: number = 0;
  private static timeout: number = 5000;
  private static userAgent: string = "Kraken Javascript API Client";

  //Variable config
  private _key: string;
  private _secret: string;
  private _options: {timeout: number, otp?: string};

  //Optional JSON reviver
  private _reviver?: (key: any, value: any) => any;

  /**
   * 
   * @param key string
   * @param secret string
   * @param options {timeout?: number, otp?: string}
   */
  constructor(key: string, secret: string, options?: {timeout?: number, otp?: string}) {
    this._key = key;
    this._secret = secret;

    if (options) {
      if(options.timeout) {
        this._options = {
          timeout: options.timeout
        };
      } else {
        this._options = {
          timeout: KrakenClient.timeout
        };
      }

      if (options.otp) {
        this._options.otp = options.otp;
      }
    } else {
      this._options = {
        timeout: KrakenClient.timeout
      };
    }
  }

  public setReviver(reviver?: (key: any, value: any) => any) {
    this._reviver = reviver;
  }

  /**
   * This method makes a public or private API request.
   * @param method string
   * @param params any
   * @param callback (error: string, result: any)
   */
  public api(method:string, params?: any, callback?: (error?: string, result?: any) => void): Promise<any> {
    if (KrakenClient.publicMethods.includes(method)) {
      return this.publicMethod(method, params, callback);
    } else if(KrakenClient.privateMethods.includes(method)) {
      return this.privateMethod(method, params, callback);
    } else {
      throw new Error(`${method} is not a valid API method.`);
    }
  }

  /**
   * 
   * @param method string
   * @param params any
   * @param callback (error?: string, result?: any)
   */
  private publicMethod(method: string, params?: any, callback?: (error?: string, result?: any) => void): Promise<any> {
    const url = `${KrakenClient.url}/${KrakenClient.version}/public/${method}`;
    const response = this.rawRequest(url, {}, params);

    if (callback) {
      response
        .then((result) => callback(undefined, result))
        .catch((error) => callback(error.message, null));
    }

    return response;
  }

  /**
   * 
   * @param method string
   * @param params any
   * @param callback (error?: string, result?: any)
   */
  private privateMethod(method: string, params?: any, callback?: (error?: string, result?: any) => void): Promise<any> {
    const path = `/${KrakenClient.version}/private/${method}`;
    const url = KrakenClient.url + path;

    if (!params) {
      params = {};
    }

    if (!params.nonce) {
      params.nonce = new Date().getTime();
    }

    if (this._options.otp) {
      params.otp = this._options.otp;
    }

    const signature = this.getMessageSignature(path, params, this._secret, params.nonce);
    const headers = {
      "API-Key": this._key,
      "API-Sign": signature
    }

    const response = this.rawRequest(url, headers, params);

    if (callback) {
      response
        .then((result) => callback(undefined, result))
        .catch((error) => callback(error.message, null));
    }

    return response;
  }

  /**
   * Create a signature for a request
   * @param path string
   * @param params any
   * @param secret string
   * @param nonce number
   */
  private getMessageSignature(path: string, params: any, secret: string, nonce: number) {
    const message       = qs.stringify(params);
    const secret_buffer = new Buffer(secret, "base64");
    const hash          = crypto.createHash("sha256");
    const hmac          = crypto.createHmac("sha512", secret_buffer);
    const hash_digest   = hash.update(nonce + message).digest();
    const path_buffer   = new Buffer(path);
    const path_hash_len = hash_digest.length + path_buffer.length;
    const path_hash     = Buffer.concat([path_buffer, hash_digest], path_hash_len);
    const hmac_digest   = hmac.update(path_hash).digest("base64");
  
    return hmac_digest;
  }

  /**
   * Send an API request
   * @param url string
   * @param headers { [key: string]: any }
   * @param params any
   */
  private async rawRequest(url: string, headers: { [key: string]: any }, params?: any): Promise<any> {
    // Set custom User-Agent string
    headers["User-Agent"] = KrakenClient.userAgent;

    const { body } = await got.post(url, {
      headers: headers,
      body: qs.stringify(params),
      timeout: this._options.timeout
    });

    const response: {error: string[]} = JSON.parse(body, this._reviver);

    if (response.error && response.error.length) {
      throw new Error(response.error.join(", "));
    }

    return response;
  }
}
