import { CONTEXTS } from '../../src/config/contexts';
import {
  appTitleCypress,
  dataCyWrapper,
  deleteButtonCypress,
  deleteConfirmButtonCypress,
  editFeedbackButtonCypress,
  feedbackInputCypress,
  feedbackTextCypress,
  logoCypress,
  refreshButtonCypress,
  responsesTableCypress,
  submitButtonCypress,
  tableNoResponsesCypress,
  wordCloudId,
  settingsButtonCypress,
  headerVisibilityCypress,
} from '../../src/config/selectors';
import {
  PERMISSION_LEVELS,
  RESPONSES_COLUMNS,
} from '../../src/config/settings';
import { MOCK_APP_DATA, MOCK_FEEDBACK } from '../fixtures/appData';

describe('<BuilderView />', () => {
  describe('Responses', () => {
    describe('Default data', () => {
      beforeEach(() => {
        cy.setUpApi({
          database: { appData: [MOCK_APP_DATA, MOCK_FEEDBACK] },
          appContext: {
            permission: PERMISSION_LEVELS.ADMIN,
            context: CONTEXTS.BUILDER,
          },
        });
        cy.visit('/');
      });

      it('Default layout', () => {
        cy.get(dataCyWrapper(logoCypress)).should('be.visible');
        cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
        cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

        cy.get(dataCyWrapper(responsesTableCypress)).should('be.visible');
        RESPONSES_COLUMNS.forEach((field) => {
          cy.get(dataCyWrapper(responsesTableCypress)).contains(field);
        });

        cy.get(`${dataCyWrapper(responsesTableCypress)} tbody tr`).contains(
          MOCK_APP_DATA.data.text
        );

        cy.get(dataCyWrapper(feedbackTextCypress)).should(
          'contain',
          MOCK_FEEDBACK.data.text
        );

        // delete feedback
        cy.get(dataCyWrapper(deleteButtonCypress)).click();
        cy.get(dataCyWrapper(deleteConfirmButtonCypress)).click();
        cy.get(dataCyWrapper(tableNoResponsesCypress)).should('exist');
      });

      it('Edit Settings', () => {
        cy.get(dataCyWrapper(settingsButtonCypress)).click();
        cy.get(dataCyWrapper(headerVisibilityCypress)).click();
      });
    });
    describe('App data without feedback', () => {
      beforeEach(() => {
        cy.setUpApi({
          database: { appData: [MOCK_APP_DATA] },
          appContext: {
            permission: PERMISSION_LEVELS.ADMIN,
            context: CONTEXTS.BUILDER,
          },
        });
        cy.visit('/');
      });

      it('Add feedback', () => {
        cy.get(dataCyWrapper(logoCypress)).should('be.visible');
        cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
        cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

        cy.get(dataCyWrapper(responsesTableCypress)).should('be.visible');
        RESPONSES_COLUMNS.forEach((field) => {
          cy.get(dataCyWrapper(responsesTableCypress)).contains(field);
        });

        cy.get(`${dataCyWrapper(responsesTableCypress)} tbody tr`).contains(
          MOCK_APP_DATA.data.text
        );
        cy.get(dataCyWrapper(feedbackTextCypress)).should(
          'not.contain',
          MOCK_FEEDBACK.data.text
        );

        // add feedback
        cy.get(dataCyWrapper(editFeedbackButtonCypress)).click();
        cy.get(dataCyWrapper(feedbackInputCypress)).type(
          MOCK_FEEDBACK.data.text
        );
        cy.get(dataCyWrapper(submitButtonCypress)).click();

        cy.get(dataCyWrapper(feedbackTextCypress)).should(
          'contain',
          MOCK_FEEDBACK.data.text
        );
      });
    });
    describe('Empty data', () => {
      beforeEach(() => {
        cy.setUpApi({
          appContext: {
            permission: PERMISSION_LEVELS.ADMIN,
            context: CONTEXTS.BUILDER,
          },
        });
        cy.visit('/');
      });

      it('Empty layout', () => {
        cy.get(dataCyWrapper(logoCypress)).should('be.visible');
        cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
        cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

        cy.get(dataCyWrapper(responsesTableCypress)).should('be.visible');
        RESPONSES_COLUMNS.forEach((field) => {
          cy.get(dataCyWrapper(responsesTableCypress)).contains(field);
        });

        cy.get(`${dataCyWrapper(tableNoResponsesCypress)}`).should(
          'be.visible'
        );
      });
    });
  });
});
