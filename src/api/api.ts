const API_KEY = 'db8423abf221064f5510359bb6c10120';
// const BASE_URL = 'http://api.exchangeratesapi.io/v1';
// const BASE_URL = 'http://10.0.2.2:3000';
const BASE_URL = 'http://127.0.0.1:3000';

type Symbols = {
  [x: string]: string;
};
type SymbolsResponse = {
  success: boolean;
  symbols: Symbols;
};
type getSymbolsResult = {
  success: boolean;
  timestamp: number;
  symbols: Symbols;
};

/**
 * This is an asynchronous function that retrieves symbols data from an API and returns a Promise with
 * the result.
 * @returns The function `getSymbols` is returning a Promise that resolves to an object of type
 * `getSymbolsResult`. This object has three properties: `success` (a boolean indicating whether the
 * API call was successful), `timestamp` (a number representing the current time), and `symbols` (an
 * object containing information about currency symbols). If the API call fails, the `success` property
 * will be `
 */
export const getSymbols = async (): Promise<getSymbolsResult> => {
  try {
    let response = await fetch(`${BASE_URL}/symbols?access_key=${API_KEY}`);
    let json: SymbolsResponse = await response.json();
    console.log(json);
    return {
      success: json.success,
      timestamp: new Date().getTime(),
      symbols: json.symbols,
    };
  } catch (error) {
    console.log('getSymbolsResponse error', error);
    return {
      success: false,
      timestamp: new Date().getTime(),
      symbols: {},
    };
  }
};

type Rates = {
  [x: string]: number;
};
type RatesResponse = {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Rates;
};

/**
 * This is a TypeScript function that fetches exchange rates data from an API and returns it as a
 * Promise.
 * @param {string} base - The base currency for which exchange rates are being requested. For example,
 * if base is set to "USD", the API will return exchange rates for other currencies relative to the US
 * dollar.
 * @param {string} symbols - The `symbols` parameter is a string that represents the currency codes for
 * which exchange rates are requested. For example, if `symbols` is set to "USD,EUR,GBP", the API will
 * return the exchange rates for US dollars, euros, and British pounds.
 * @returns The `getRates` function returns a Promise that resolves to a `RatesResponse` object. If the
 * function encounters an error, it returns a `RatesResponse` object with `success` set to `false` and
 * an empty `rates` object.
 */
export const getRates = async (
  base: string,
  symbols: string,
): Promise<RatesResponse> => {
  try {
    let response = await fetch(
      `${BASE_URL}/latest?access_key=${API_KEY}&base=${base}&symbols=${symbols}`,
    );
    let json: RatesResponse = await response.json();
    json.timestamp *= 1000;
    console.log(json);
    return json;
  } catch (error) {
    console.log('getRatesResponse error', error);
    return {
      success: false,
      timestamp: new Date().getTime(),
      base,
      date: new Date().toISOString(),
      rates: {},
    };
  }
};
