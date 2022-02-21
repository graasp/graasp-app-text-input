import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import { mockServer, buildMockLocalContext } from '@graasp/apps-query-client';
import buildDatabase from './data/db';
import { MOCK_API } from './config/settings';
import './index.css';

// setup mocked api for cypress or standalone app
if (MOCK_API) {
  const appContext = buildMockLocalContext(window.appContext);
  const database = window.Cypress ? window.database : buildDatabase(appContext);
  mockServer({ database, appContext });
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
