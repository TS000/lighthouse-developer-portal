import React from 'react';
import { render } from '@testing-library/react';
import { ContributingGuide } from './ContributingGuide';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';

describe('ContributingGuideComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get(
        'https://raw.githubusercontent.com/department-of-veterans-affairs/lighthouse-developer-portal/main/docs/contributing-guide.md',
        (_, res, ctx) => res(ctx.status(200), ctx.delay(2000), ctx.json({})),
      ),
    );
  });
  it('should render', async () => {
    const rendered = render(<ContributingGuide />);
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
