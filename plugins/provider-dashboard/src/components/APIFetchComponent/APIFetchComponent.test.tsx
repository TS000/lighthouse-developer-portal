import React from 'react';
import { APIFetchComponent } from './APIFetchComponent';
import { TestApiProvider, renderInTestApp, MockConfigApi } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';


describe('APIFetchComponent', () => {
  beforeEach(() => {
    jest.resetModules(); // clear the cache
  });

  it('should render', async () => {
    const mockConfig = new MockConfigApi({
      backend: { baseUrl: 'http://internal-a4d95ec490108442a940e05e10d9e3d7-665278146.us-gov-west-1.elb.amazonaws.com' },
    })
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <APIFetchComponent />
      </TestApiProvider>);
      
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
