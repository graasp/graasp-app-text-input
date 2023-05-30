import { createRoot } from 'react-dom/client';
import Root from './components/Root';
import { mockApi } from '@graasp/apps-query-client';
import { DEFAULT_LOCAL_CONTEXT, ENABLE_MOCK_API } from './config/settings';
import './index.css';

// setup mocked api for cypress or standalone app
if (ENABLE_MOCK_API) {
  mockApi({
    appContext: window.Cypress ? window.appContext : DEFAULT_LOCAL_CONTEXT,
    database: window.Cypress ? window.database : undefined,
  });
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);
root.render(<Root />);
