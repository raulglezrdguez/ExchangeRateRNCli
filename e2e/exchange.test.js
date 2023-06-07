/* global device element by */

describe('Exchange screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have Exchange screen', async () => {
    await expect(element(by.text('Exchange'))).toBeVisible();
    await expect(element(by.id('amount'))).toBeVisible();
  });

  it('should show Dropdown list modal after tap', async () => {
    await element(by.id('dropdown_Select from')).tap();
    await expect(element(by.text('Euro'))).toBeVisible();
  });

  it('should calculate the exchange', async () => {
    await element(by.id('amount')).replaceText('12');
    await element(by.id('dropdown_Select from')).tap();
    await element(by.text('Euro')).tap();
    await element(by.id('dropdown_Select to')).tap();
    await element(by.text('Afghan Afghani')).tap();
    await element(by.text('Convert')).tap();
    await expect(
      element(by.text('12 Euro is equivalent to 1124.32 Afghan Afghani')),
    ).toBeVisible();
  });
});
