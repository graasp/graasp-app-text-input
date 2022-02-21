import {
  dataCyWrapper,
  inputTextFieldSelector,
  saveButtonCypress,
} from '../../src/config/selectors';
import { AUTO_SAVE_PAUSE, LOAD_PAGE_PAUSE } from '../constants/constants';
import { MOCK_APP_DATA } from '../fixtures/appData';

const text = 'Some input text.';

describe('<StudentView />', () => {
  describe('Empty database', () => {
    describe('offline = true', () => {
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
      });
    });

    describe('offline = false', () => {
      beforeEach(() => {
        cy.setUpApi();
        cy.visit('/');
        cy.wait(LOAD_PAGE_PAUSE);
      });

      it('saves typed data', () => {
        // no save button
        cy.get(dataCyWrapper(saveButtonCypress)).should('not.exist');

        // type text
        cy.enterStudentResponse(text);

        // text remains for auto saving
        cy.wait(AUTO_SAVE_PAUSE);
        cy.get(inputTextFieldSelector).contains(text);

        // clear
        cy.clearStudentResponse();

        // input is empty
        cy.wait(AUTO_SAVE_PAUSE);
        cy.get(inputTextFieldSelector).should('be.empty');
      });
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
