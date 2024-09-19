import {
  dataCyWrapper,
  inputTextFieldId,
  inputTextFieldSelector,
  publicAlertBannerIdCypress,
  saveButtonCypress,
} from '../../src/config/selectors';
import { MEMBERS } from '../fixtures/members';

import {
  MOCK_APP_DATA,
  MOCK_APP_DATA_BOB,
  MOCK_FEEDBACK,
} from '../fixtures/appData';
import { Context, PermissionLevel } from '@graasp/sdk';

const text = 'Some input text.';

describe('<PlayerView />', () => {
  describe('Empty database', () => {
    beforeEach(() => {
      cy.setUpApi({
        appContext: {
          context: Context.Player,
          permission: PermissionLevel.Read,
        },
      });
      cy.visit('/');
    });

    // save with button when offline
    it('input contains typed text', () => {
      // type content
      cy.enterStudentResponse(text);

      // click save and check content is saved with button being disabled
      cy.get(dataCyWrapper(saveButtonCypress))
        .should('be.visible')
        .and('not.have.attr', 'disabled');
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
    it('Display pre-saved data', () => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: {
          accountId: MEMBERS.ANNA.id,
          context: Context.Player,
          permission: PermissionLevel.Read,
        },
      });
      cy.visit('/');
      cy.get(inputTextFieldSelector).contains(MOCK_APP_DATA.data.text);
    });

    it('Display pre-saved data and feedback', () => {
      cy.setUpApi({
        appContext: {
          accountId: MEMBERS.BOB.id,
          context: Context.Player,
          permission: PermissionLevel.Read,
        },
        database: { appData: [MOCK_APP_DATA_BOB, MOCK_FEEDBACK] },
      });
      cy.visit('/');
      cy.get(inputTextFieldSelector).contains(MOCK_APP_DATA_BOB.data.text);
      cy.get(`#${inputTextFieldId}-helper-text`).contains(
        MOCK_FEEDBACK.data.text
      );
    });
  });
  describe('Public Access', () => {
    beforeEach(() => {
      cy.setUpApi({
        appContext: {
          context: Context.Player,
          permission: undefined,
          accountId: undefined,
        },
      });
      cy.visit('/');
    });

    it('Shows public alert', () => {
      cy.get(`#${publicAlertBannerIdCypress}`).should('be.visible');
      cy.get(dataCyWrapper(saveButtonCypress)).should('be.disabled');
    });
  });
});
