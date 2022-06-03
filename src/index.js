import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import { mockApi } from '@graasp/apps-query-client';
import { ENABLE_MOCK_API } from './config/settings';
import './index.css';

// setup mocked api for cypress or standalone app
if (ENABLE_MOCK_API) {
  mockApi({
    appContext: window.Cypress ? window.appContext : undefined,
    database: window.Cypress ? window.database : undefined,
  });
}

const root = document.getElementById('root');

const renderApp = (RootComponent) => {
  render(<RootComponent />, root);
};

// render app to the dom
renderApp(Root);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextRoot = require('./components/Root').default;
    renderApp(NextRoot);
  });
}
