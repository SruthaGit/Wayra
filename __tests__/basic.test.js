// Basic test to verify Jest setup
describe('Basic Jest Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should handle basic math', () => {
    expect(2 * 3).toBe(6);
  });
}); 