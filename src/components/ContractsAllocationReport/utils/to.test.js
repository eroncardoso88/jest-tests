import to from './to';

describe('to', () => {
  it('should check resolve a promise', async () => {
    const successData = { ok: true };

    const promise = () => new Promise(resolve => resolve(successData));

    const [error, data] = await to(promise());

    expect(error).toBeUndefined();
    expect(data).toBe(successData);
  });

  it('should check reject a promise', async () => {
    const errorData = { error: true };

    const promise = () => new Promise((_, reject) => reject(errorData));

    const [error, data] = await to(promise());

    expect(error).toBe(errorData);
    expect(data).toBeUndefined();
  });
});
