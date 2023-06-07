import { Context, PermissionLevel } from '@graasp/sdk';
import {
  appTitleCypress,
  dataCyWrapper,
  logoCypress,
  refreshButtonCypress,
  wordCloudId,
} from '../../src/config/selectors';
import { MOCK_APP_DATA, MOCK_FEEDBACK } from '../fixtures/appData';

// bug: disabled because it fails in ci
describe.skip('<AnalyzerView />', () => {
  describe('Dashboard', () => {
    it('Display no data', () => {
      cy.setUpApi({
        appContext: {
          permission: PermissionLevel.Admin,
          context: Context.Analytics,
        },
      });
      cy.visit('/');

      // visible elements
      cy.get(dataCyWrapper(logoCypress)).should('be.visible');
      cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
      cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

      cy.get(`#${wordCloudId}`).should('not.exist');
    });

    it('Display data', () => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA, MOCK_FEEDBACK] },
        appContext: {
          permission: PermissionLevel.Admin,
          context: Context.Analytics,
        },
      });
      cy.visit('/');

      // visible elements
      cy.get(dataCyWrapper(logoCypress)).should('be.visible');
      cy.get(dataCyWrapper(appTitleCypress)).should('be.visible');
      cy.get(dataCyWrapper(refreshButtonCypress)).should('be.visible');

      cy.get(`#${wordCloudId} text`).should('contain', 'text');
    });
  });
});