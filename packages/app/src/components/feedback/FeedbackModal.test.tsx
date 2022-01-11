import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import { FeedbackModal, Modal, TabPanel } from './FeedbackModal';
import { createApp } from '@backstage/app-defaults';

describe('FeedbackModal', () => {
  const app = createApp();

  const AppProvider = app.getProvider();

  process.env = {
    NODE_ENV: 'test',
    APP_CONFIG: [
      {
        data: {
          app: { title: 'Feedback modal tests' },
          backend: { baseUrl: 'http://localhost:7007' },
          techdocs: {
            storageUrl: 'http://localhost:7007/api/techdocs/static/docs',
          },
        },
        context: 'feedback modal with empty app provider',
      },
    ] as any,
  };

  it('should render FeedbackModal', async () => {
    const rendered = await renderWithEffects(
      <AppProvider>
        <FeedbackModal />
      </AppProvider>,
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });

  it('should render a Modal', async () => {
    const rendered = await renderWithEffects(
      <AppProvider>
        <Modal toggleModal={() => {}} />
      </AppProvider>,
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });

  it('should render TabPanel', async () => {
    const rendered = await renderWithEffects(
      <AppProvider>
        <TabPanel value={0} index={0}>
          <p>Content...</p>
        </TabPanel>
      </AppProvider>,
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
