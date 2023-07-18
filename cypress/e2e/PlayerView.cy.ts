import {
  dataCyWrapper,
  inputTextFieldSelector,
  saveButtonCypress,
} from '../../src/config/selectors';
import { LOAD_PAGE_PAUSE } from '../constants/constants';
import { MOCK_APP_DATA } from '../fixtures/appData';

const text = 'Some input text.';

describe('<PlayerView />', () => {
  describe('Empty database', () => {
    beforeEach(() => {
      cy.setUpApi({ appContext: { offline: true } });
      cy.visit('/');
      cy.wait(LOAD_PAGE_PAUSE);
    });

    // save with button when offline
    it('input contains typed text', () => {
      // type content
      cy.enterStudentResponse(text);

      // click save and check content is saved with button being disabled
      cy.get(dataCyWrapper(saveButtonCypress))
        .should('be.visible')
        .should('not.have.attr', 'disabled');
      cy.get(dataCyWrapper(saveButtonCypress)).click();

      cy.get(dataCyWrapper(saveButtonCypress))
        .should('be.visible')
        .should('have.attr', 'disabled');
      cy.get(inputTextFieldSelector).contains(text);

      // input new content and should display it
      const text2 = 'new text again';
      cy.enterStudentResponse(text2);
      cy.get(inputTextFieldSelector).contains(text2);
    });
  });

  describe('Default database', () => {
    beforeEach(() => {
      cy.setUpApi({ database: { appData: [MOCK_APP_DATA] } });
      cy.visit('/');
    });

    it('Display pre-saved data', () => {
      cy.get(inputTextFieldSelector).contains(MOCK_APP_DATA.data.text);
    });
  });
});
