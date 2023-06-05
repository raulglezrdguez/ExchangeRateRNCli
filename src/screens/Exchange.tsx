import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GetSymbolsResult,
  RatesResponse,
  Symbols,
  getRates,
  getSymbols,
} from '../api/api';
import {
  MAX_TIMESTAMP_UPDATE_RATES,
  MAX_TIMESTAMP_UPDATE_SYMBOLS,
} from '../consts';
import {Rates} from '../api/api';
import Dropdown from '../components/Dropdown';

const Separator = () => <View style={styles.separator} />;

type KeyValue = {key: string; value: string};
type ArrayKeyValue = Array<KeyValue>;

const Exchange = () => {
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState('');

  const [selectedFrom, setSelectedFrom] = useState<KeyValue | undefined>(
    undefined,
  );
  const [selectedTo, setSelectedTo] = useState<KeyValue | undefined>(undefined);
  const [data, setData] = useState<ArrayKeyValue>([]);

  const fillItems = (symbols: Symbols) => {
    const items: ArrayKeyValue = [];
    for (const [key, value] of Object.entries(symbols)) {
      items.push({key, value});
    }
    setData(items);
  };

  const loadSymbols = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('@symbols');
      if (value !== null) {
        const symbols: GetSymbolsResult = JSON.parse(value);
        const timestamp = symbols.timestamp;
        const currentTimestamp = new Date().getTime();
        if (currentTimestamp - timestamp < MAX_TIMESTAMP_UPDATE_SYMBOLS) {
          fillItems(symbols.symbols);
          return;
        }
      }
      const newSymbols = await getSymbols();
      fillItems(newSymbols.symbols);
      await AsyncStorage.setItem(
        '@symbols',
        JSON.stringify({
          timestamp: newSymbols.timestamp,
          symbols: newSymbols.symbols,
        }),
      );
    } catch (e) {
      console.log('loadSymbols error: ' + e);
    }
  }, []);

  const loadRates = useCallback(
    async (base: string, symbols: string): Promise<Rates> => {
      try {
        const value = await AsyncStorage.getItem(`@${base}`);
        if (value !== null) {
          const currentRates: RatesResponse = JSON.parse(value);
          const timestamp = currentRates.timestamp;
          const currentTimestamp = new Date().getTime();
          if (currentTimestamp - timestamp < MAX_TIMESTAMP_UPDATE_RATES) {
            return currentRates.rates;
          }
        }
        const newRates = await getRates(base, symbols);
        if ('error' in newRates) {
          setResult(newRates.error.message);
          return {};
        } else {
          await AsyncStorage.setItem(
            `@${base}`,
            JSON.stringify({
              timestamp: newRates.timestamp,
              rates: newRates.rates,
            }),
          );
          return newRates.rates;
        }
      } catch (e) {
        console.log('loadRates error: ' + e);
        return {};
      }
    },
    [],
  );

  useEffect(() => {
    loadSymbols();
  }, [loadSymbols]);

  const convert = async () => {
    if (
      selectedFrom?.key !== '' &&
      selectedFrom?.value &&
      selectedTo?.key !== ''
    ) {
      try {
        const rates = await loadRates(
          selectedFrom.key,
          'AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYN,BYR,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLE,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VES,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL',
        );
        if (Object.entries(rates).length > 0) {
          for (const [key, value] of Object.entries(rates)) {
            if (key === selectedTo?.key) {
              const res = (value * parseFloat(amount)).toFixed(2);
              const label = `${amount} ${selectedFrom.value} is equivalent to ${res} ${selectedTo.value}`;
              setResult(label);
              return;
            }
          }
          setResult('Not found');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exchange</Text>
      <TextInput
        testID="amount"
        style={styles.inputAmount}
        onChangeText={val => setAmount(val)}
        value={amount}
        placeholder="amount to exchange"
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>From:</Text>
          <Dropdown
            label="Select from"
            data={data}
            onSelect={setSelectedFrom}
          />
        </View>

        <View style={[styles.column]}>
          <Text style={styles.label}>To:</Text>
          <Dropdown label="Select to" data={data} onSelect={setSelectedTo} />
        </View>
      </View>
      <Separator />

      <Button
        title="Convert"
        onPress={convert}
        disabled={
          selectedFrom === undefined ||
          selectedTo === undefined ||
          selectedFrom.key === selectedTo.key
        }
      />

      <Separator />
      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
};

export default Exchange;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
  },
  result: {
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'lightblue',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    maxWidth: '80%',
    marginBottom: 20,
  },
  inputAmount: {
    height: 40,
    minWidth: 100,
    maxWidth: '80%',
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '45%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});
