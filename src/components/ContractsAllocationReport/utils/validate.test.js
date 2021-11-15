import isArrayEmpty from './validate';

describe('Empty Array', () => {
it ('should return a empty Array', async () => {
   await expect(isArrayEmpty(data)).toEqual(0);
  });
});
