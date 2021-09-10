import { featureFlagsPagePlugin, useFeatureFlags } from './plugin';

describe('feature-flags', () => {
  it('should export plugin', () => {
    expect(featureFlagsPagePlugin).toBeDefined();
  });
  it('should export react hook', () => {
    expect(useFeatureFlags).toBeDefined();
  });
});
