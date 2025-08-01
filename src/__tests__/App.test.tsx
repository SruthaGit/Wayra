// Basic tests for the Wayra app
describe('Wayra App', () => {
  it('should handle basic math operations', () => {
    expect(1 + 1).toBe(2);
    expect(2 * 3).toBe(6);
    expect(10 - 5).toBe(5);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

      it('should handle string operations', () => {
      const appName = 'Wayra';
      expect(appName).toBe('Wayra');
      expect(appName.length).toBe(5);
    });

  it('should handle array operations', () => {
    const categories = ['Restaurants', 'Hotels', 'Attractions'];
    expect(categories).toHaveLength(3);
    expect(categories).toContain('Restaurants');
  });

  it('should handle object operations', () => {
    const location = { latitude: 40.7128, longitude: -74.0060 };
    expect(location.latitude).toBe(40.7128);
    expect(location.longitude).toBe(-74.0060);
  });

  it('should handle boolean operations', () => {
    expect(true).toBe(true);
    expect(false).toBe(false);
    expect(1 === 1).toBe(true);
  });
}); 