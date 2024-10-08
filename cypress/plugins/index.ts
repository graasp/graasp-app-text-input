// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import setupCoverage from '@cypress/code-coverage/task';

const config: Cypress.PluginConfig = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const newConfig = {
    ...config,
    env: {
      API_HOST: process.env.REACT_APP_API_HOST,
    },
  };
  setupCoverage(on, newConfig);
  return newConfig;
};
export default config;
