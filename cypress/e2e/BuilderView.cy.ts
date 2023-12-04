import { Context, PermissionLevel } from '@graasp/sdk';
import {
  appTitleCypress,
  dataCyWrapper,
  deleteButtonCypress,
  deleteConfirmButtonCypress,
  editFeedbackButtonCypress,
  feedbackInputCypress,
  feedbackTextCypress,
  refreshButtonCypress,
  responsesTableCypress,
  submitButtonCypress,
  tableNoResponsesCypress,
  settingsButtonCypress,
  headerVisibilityCypress,
  studentResponseId,
  responseCellCypress,
  feedbackCellCypress,
} from '../../src/config/selectors';
import { RESPONSES_COLUMNS } from '../../src/config/settings';
import {
  MOCK_APP_DATA,
  MOCK_APP_DATA_BOB,
  MOCK_FEEDBACK,
} from '../fixtures/appData';
import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';

describe('<BuilderView />', () => {
  describe('Responses', () => {
    describe('Default data', () => {
      beforeEach(() => {
        cy.setUpApi({
          database: {
            appData: [MOCK_APP_DATA, MOCK_APP_DATA_BOB, MOCK_FEEDBACK],
          },
          appContext: {
            memberId: CURRENT_MEMBER.id,
            permission: PermissionLevel.Admin,
            context: Context.Builder,
          },
        });
        cy.visit('/');
      });

      it('Default layout', () => {
        cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
        cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

        cy.get(dataCyWrapper(responsesTableCypress)).should('be.visible');
        RESPONSES_COLUMNS.forEach((field) => {
          cy.get(dataCyWrapper(responsesTableCypress)).should('contain', field);
        });

        cy.get(
          `${dataCyWrapper(studentResponseId(MEMBERS.ANNA.id))} ${dataCyWrapper(
            responseCellCypress
          )}`
        ).should('contain', MOCK_APP_DATA.data.text);

        cy.get(
          `${dataCyWrapper(studentResponseId(MEMBERS.BOB.id))} ${dataCyWrapper(
            feedbackCellCypress
          )}`
        ).should('contain', MOCK_FEEDBACK.data.text);

        // delete feedback
        cy.get(
          `${dataCyWrapper(studentResponseId(MEMBERS.ANNA.id))} ${dataCyWrapper(
            deleteButtonCypress
          )}`
        ).click();
        cy.get(dataCyWrapper(deleteConfirmButtonCypress)).click();
        cy.get(`${dataCyWrapper(studentResponseId(MEMBERS.ANNA.id))}`).should(
          'not.exist'
        );
        cy.get(
          `${dataCyWrapper(studentResponseId(MEMBERS.BOB.id))} ${dataCyWrapper(
            deleteButtonCypress
          )}`
        ).click();
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
            permission: PermissionLevel.Admin,
            context: Context.Builder,
          },
        });
        cy.visit('/');
      });

      it('Add feedback', () => {
        cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
        cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

        cy.get(dataCyWrapper(responsesTableCypress)).should('be.visible');
        RESPONSES_COLUMNS.forEach((field) => {
          cy.get(dataCyWrapper(responsesTableCypress)).should('contain', field);
        });

        cy.get(`${dataCyWrapper(responsesTableCypress)} tbody tr`).should(
          'contain',
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
            permission: PermissionLevel.Admin,
            context: Context.Builder,
          },
        });
        cy.visit('/');
      });

      it('Empty layout', () => {
        cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
        cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

        cy.get(dataCyWrapper(responsesTableCypress)).should('be.visible');
        RESPONSES_COLUMNS.forEach((field) => {
          cy.get(dataCyWrapper(responsesTableCypress)).should('contain', field);
        });

        cy.get(`${dataCyWrapper(tableNoResponsesCypress)}`).should(
          'be.visible'
        );
      });
    });
  });
});
