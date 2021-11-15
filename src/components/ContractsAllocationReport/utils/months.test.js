import months from './months';

describe('months', () => {
  it('should verify months export', () => {
    expect(Array.isArray(months)).toBeTruthy();

    expect(months[0]).toBe('january');
    expect(months[1]).toBe('february');
    expect(months[2]).toBe('march');
    expect(months[3]).toBe('april');
    expect(months[4]).toBe('may');
    expect(months[5]).toBe('june');
    expect(months[6]).toBe('july');
    expect(months[7]).toBe('august');
    expect(months[8]).toBe('september');
    expect(months[9]).toBe('october');
    expect(months[10]).toBe('november');
    expect(months[11]).toBe('december');
  });
});
