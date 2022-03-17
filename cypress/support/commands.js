import { inputTextFieldSelector } from '../../src/config/selectors';
import { MOCK_SERVER_ITEM } from '../fixtures/appData';
import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';

Cypress.Commands.add(
  'setUpApi',
  ({ currentMember = CURRENT_MEMBER, database = {}, appContext } = {}) => {
    // mock api and database
    Cypress.on('window:before:load', (win) => {
      win.database = {
        currentMember,
        currentItemId: MOCK_SERVER_ITEM.id,
        members: Object.values(MEMBERS),
        ...database,
      };
      win.appContext = appContext;
    });
  }
);

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
