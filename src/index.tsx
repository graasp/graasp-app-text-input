import { createRoot } from 'react-dom/client';
import Root from './components/Root';
import { MockSolution, mockApi } from '@graasp/apps-query-client';
import { ENABLE_MOCK_API } from './config/settings';
import './index.css';
import buildDatabase, { defaultMockContext, mockMembers } from './mocks/db';

// setup mocked api for cypress or standalone app
if (ENABLE_MOCK_API) {
  mockApi(
    {
      // dbName: window.Cypress ? 'graasp-app-cypress' : undefined,
      appContext: window.Cypress ? window.appContext : defaultMockContext,
      database: window.Cypress
        ? window.database
        : buildDatabase(defaultMockContext, mockMembers),
    },
    MockSolution.MirageJS
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);
root.render(<Root />);
