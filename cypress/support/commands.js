import { inputTextFieldSelector } from '../../src/config/selectors';
import { MEMBERS } from '../fixtures/members';

Cypress.Commands.add('setUpApi', ({ database = {}, appContext } = {}) => {
  // mock api and database
  Cypress.on('window:before:load', (win) => {
    win.database = {
      appData: [],
      appActions: [],
      appSettings: [],
      members: Object.values(MEMBERS),
      ...database,
    };
    win.appContext = appContext;
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
