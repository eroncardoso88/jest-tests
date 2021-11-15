import { formatValueMoney, formatValueDecimal } from './formatValue';

describe('formatValue', () => {
  it('should convert number to money format', () => {
    expect(formatValueMoney(20)).toBe('20,00');
    expect(formatValueMoney(2000000)).toBe('2.000.000,00');
    expect(formatValueMoney(200.256)).toBe('200,26');
    expect(formatValueMoney(200.254)).toBe('200,25');
    expect(formatValueMoney(200.99999999)).toBe('201,00');
    expect(formatValueMoney(200.1)).toBe('200,10');
  });

  it('should convert number to decimal format', () => {
    expect(formatValueDecimal(20)).toBe('20');
    expect(formatValueDecimal(2000000)).toBe('2,000,000');
    expect(formatValueDecimal(2000000.9925)).toBe('2,000,000.993');
    expect(formatValueDecimal(0.123456)).toBe('0.123');
    expect(formatValueDecimal(0.123656)).toBe('0.124');
  });
});
