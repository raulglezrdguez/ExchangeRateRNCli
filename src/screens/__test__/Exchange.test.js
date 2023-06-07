import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
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

  it('renders amount input', async () => {
    const {getAllByPlaceholderText, getByPlaceholderText} = await waitFor(() =>
      render(<Exchange />),
    );

    expect(getAllByPlaceholderText('amount to exchange').length).toBe(1);

    const amount = getByPlaceholderText('amount to exchange');
    fireEvent.changeText(amount, '12');
  });

  it('renders Convert button', async () => {
    await waitFor(() => render(<Exchange />));

    const button = screen.getByText('Convert');
    expect(button).toBeDefined();
  });

  it('calculates the exchange', async () => {
    await waitFor(() => render(<Exchange />));

    const amount = screen.getByPlaceholderText('amount to exchange');
    fireEvent.changeText(amount, '12');

    const from = screen.getByText('Select from');
    fireEvent.press(from);

    const eur = screen.getByText('Euro');
    fireEvent.press(eur);

    const to = screen.getByText('Select to');
    fireEvent.press(to);

    const usd = screen.getByText('Afghan Afghani');
    fireEvent.press(usd);

    const convert = screen.getByText('Convert');
    fireEvent.press(convert);

    await waitFor(() =>
      expect(screen.queryByText('12 Euro is equivalent to')).toBeDefined(),
    );
  });
});
