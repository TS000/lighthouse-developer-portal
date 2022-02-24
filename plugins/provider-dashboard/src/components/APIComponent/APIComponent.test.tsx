import React from 'react';
import { APIComponent } from './APIComponent';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";

describe('APIComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <APIComponent />
      </ThemeProvider>,
    );
    expect(rendered.getByText('Overview')).toBeInTheDocument();
    expect(rendered.getByText('Configuration')).toBeInTheDocument();
    expect(rendered.getByText('Authorization/Routing')).toBeInTheDocument();
    expect(rendered.getByText('Manage OAS')).toBeInTheDocument();
    expect(rendered.getByText('Endpoint Status')).toBeInTheDocument();
  });
});
