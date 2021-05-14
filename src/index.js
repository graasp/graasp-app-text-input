import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import configureServer from './config/api';
import './index.css';

// setup mocked api
if (window.Cypress) {
  configureServer({
    database: window.database,
  });
}
// else if (
//   process.env.NODE_ENV === 'development' &&
//   process.env.REACT_APP_MOCK_API === 'true'
// ) {
//   configureServer();
// }

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
