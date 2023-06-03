import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

import {SYMBOLS} from './symbols';
import {RATES} from './rates';
import Exchange from '../Exchange';

describe('Exchange', () => {
  beforeEach(async () => {
    const jsonSymbols = JSON.stringify(SYMBOLS);
    await AsyncStorage.setItem('@symbols', jsonSymbols);
    const jsonRates = JSON.stringify(RATES);
    await AsyncStorage.setItem('@EUR', jsonRates);
  });

  it('renders Exchange screen', async () => {
    await waitFor(() => render(<Exchange />));
  });
});
