import { datadogDashboardPlugin } from './plugin';

describe('datadog-dashboard', () => {
  it('should export plugin', () => {
    expect(datadogDashboardPlugin).toBeDefined();
  });
});
