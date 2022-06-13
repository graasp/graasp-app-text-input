import { CONTEXTS } from '../../src/config/contexts';
import {
  appTitleCypress,
  dataCyWrapper,
  logoCypress,
  refreshButtonCypress,
  wordCloudId,
} from '../../src/config/selectors';
import { PERMISSION_LEVELS } from '../../src/config/settings';
import { MOCK_APP_DATA, MOCK_FEEDBACK } from '../fixtures/appData';

describe('<BuilderView />', () => {
  describe('Dashboard', () => {
    it('Display no data', () => {
      cy.setUpApi({
        appContext: {
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.ANALYZER,
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
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.ANALYZER,
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
