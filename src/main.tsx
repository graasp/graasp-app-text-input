import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './components/Root';
import { MockSolution, mockApi } from '@graasp/apps-query-client';
import './index.css';
import buildDatabase, { defaultMockContext, mockMembers } from './mocks/db';
import { MOCK_API } from './config/env';
import * as Sentry from '@sentry/react';
import { generateSentryConfig } from './config/sentry';

Sentry.init({
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  ...generateSentryConfig(),
});

// setup mocked api for cypress or standalone app
if (MOCK_API) {
  mockApi(
    {
      // dbName: window.Cypress ? 'graasp-app-cypress' : undefined,
      appContext: window.Cypress ? window.appContext : defaultMockContext,
      database: window.Cypress ? window.database : buildDatabase(mockMembers),
    },
    window.Cypress ? MockSolution.MirageJS : MockSolution.ServiceWorker
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
