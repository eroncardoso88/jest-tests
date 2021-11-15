import states from './table';

describe('Table', () => {
it ('should return a list with states', async () => {
   await expect(Array.isArray(states)).toBeTruthy();
  });
});
