/// <reference types="../../src/window.d.ts" />
import { inputTextFieldSelector } from '../../src/config/selectors';
import { MEMBERS } from '../fixtures/members';
import { mockItem, defaultMockContext } from '../../src/mocks/db';

Cypress.Commands.add('setUpApi', ({ database = {}, appContext } = {}) => {
  // mock api and database
  const fullAppContext = {
    ...defaultMockContext,
    ...appContext,
  };
  Cypress.on('window:before:load', (win) => {
    win.database = {
      appData: [],
      appActions: [],
      appSettings: [],
      members: Object.values(MEMBERS),
      items: [mockItem],
      ...database,
    };
    win.appContext = fullAppContext;
  });
});

Cypress.Commands.add('enterStudentResponse', (text) => {
  const input = cy.get(inputTextFieldSelector);
  if (!text || text === '') {
    input.clear().should('be.empty');
  } else {
    input.type(text).contains(text);
  }
});

Cypress.Commands.add('clearStudentResponse', () => {
  cy.enterStudentResponse('');
});
