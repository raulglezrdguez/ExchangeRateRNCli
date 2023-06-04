import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';

import Dropdown from '../Dropdown';

describe('Dropdown component', () => {
  beforeEach(async () => {
    const data = [
      {key: '1', value: 'foo'},
      {key: '2', value: 'bar'},
    ];

    render(<Dropdown label="Test" data={data} onSelect={jest.fn} />);
  });

  it('renders Dropdown component', async () => {
    expect(screen.getAllByText('Test').length).toBe(1);
  });

  it('show dropdown list on touch', () => {
    const button = screen.getByText('Test');
    fireEvent.press(button);

    expect(screen.getAllByText('foo').length).toBe(1);
    expect(screen.getAllByText('bar').length).toBe(1);
  });

  it('select element from dropdown list', () => {
    const button = screen.getByText('Test');
    fireEvent.press(button);

    const foo = screen.getByText('foo');
    fireEvent.press(foo);

    expect(screen.getAllByText('foo').length).toBe(1);
    expect(screen.queryAllByText('bar').length).toBe(0);
  });
});
