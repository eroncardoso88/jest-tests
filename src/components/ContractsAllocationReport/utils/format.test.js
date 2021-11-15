import { formatToBRL, formatWithoutBRL, parseStringToFloat } from './format';

describe('format numbers', () => {
  it('should convert to BRL format', () => {
    expect(formatToBRL('20.00')).toBe('20,00');
    expect(formatToBRL('199.00')).toBe('199,00');

  });

  it('should remove BRL', () => {
    expect(formatWithoutBRL('R$ 20')).toBe('20');

  });

  it('convert string to float number', () => {
    expect(parseStringToFloat('20')).toEqual(20);
    expect(parseStringToFloat('2000000')).toBe(2000,000);
    expect(parseStringToFloat('2000000.9925')).toBe(2000000,993);


  });
});
