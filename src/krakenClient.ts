import * as crypto from "crypto";
import * as qs from "qs";
import * as got from "got";

export class KrakenClient {

  //Default config
  private static url: string = "https://api.kraken.com";
  private static version: number = 0;
  private static timeout: number = 5000;
  private static userAgent: string = "Kraken Javascript API Client";

  //Variable config
  private _key: string;
  private _secret: string;
  private _options: string;

  constructor(key: string, secret: string, options: string) {
    this._key = key;
    this._secret = secret;
    this._options = options;
  }

  // Create a signature for a request
  private getMessageSignature(path: string, request: object, secret: string, nonce: number) {
    const message       = qs.stringify(request);
    const secret_buffer = new Buffer(secret, "base64");
    const hash          = crypto.createHash("sha256");
    const hmac          = crypto.createHmac("sha512", secret_buffer);
    const hash_digest   = hash.update(nonce + message).digest("latin1");
    const hmac_digest   = hmac.update(path + hash_digest, "latin1").digest("base64");
  
    return hmac_digest;
  }

  //Send an API request
  private async rawRequest(url: string, headers: { [key: string]: any }, data: any) {
    // Set custom User-Agent string
    headers["User-Agent"] = KrakenClient.userAgent;

    const { body } = await got.post(url, {
      headers: headers,
      body: qs.stringify(data),
      timeout: KrakenClient.timeout
    });

    const response = JSON.parse(body);

    if (response.error && response.error.length) {
      const error: [string] = response.error
        .filter((e: string) => e.startsWith('E'))
        .map((e: string) => e.substr(1));

        if (!error.length) {
          throw new Error("Kraken API returned an unknown error");
        }

        throw new Error(error.join(", "));
    }

    return response;
  }
}
