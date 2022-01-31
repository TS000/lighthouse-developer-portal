import React from 'react';
import { render } from '@testing-library/react';
import { APIFetchComponent } from './APIFetchComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

describe('APIFetchComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    const config = useApi(configApiRef);
    const backendUrl = config.getString('backend.baseUrl');
    const proxyPath = '/api/proxy';
    const basePath = `${backendUrl}${proxyPath}`;
    
    server.use(
      rest.get(`${basePath}/docserver/apis/`, (_, res, ctx) =>    // TODO: Move this call into a proper client soon
        res(ctx.status(200), ctx.delay(2000), ctx.json({})),
      ),
    );
  });
  it('should render', async () => {
    const rendered = render(<APIFetchComponent />);
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
