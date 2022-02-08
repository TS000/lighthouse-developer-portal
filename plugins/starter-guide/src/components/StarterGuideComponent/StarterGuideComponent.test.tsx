import React from 'react';
import { render } from '@testing-library/react';
import { StarterGuideComponent } from './StarterGuideComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';

describe('StarterGuideComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-embark/main/docs/starter-guide.md', (_, res, ctx) =>
        res(ctx.status(200), ctx.delay(2000), ctx.json({})),
      ),
    );
  });
  it('should render', async () => {
    const rendered = render(<StarterGuideComponent />);
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
