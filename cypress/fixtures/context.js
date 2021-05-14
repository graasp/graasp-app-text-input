import { CURRENT_MEMBER } from './members';
import { CURRENT_ITEM } from './appData';
import { LOAD_PAGE_PAUSE } from '../constants/constants';
import { PERMISSION_LEVELS } from '../../src/config/settings';
import { CONTEXTS } from '../../src/config/contexts';

const API_HOST = Cypress.env('API_HOST');

export const buildMockLocalContext = ({
  itemId = CURRENT_ITEM.id,
  memberId = CURRENT_MEMBER.id,
  offline = false,
  apiHost = API_HOST,
  permission = PERMISSION_LEVELS.READ,
  context = CONTEXTS.PLAYER,
} = {}) => ({
  itemId,
  memberId,
  apiHost,
  offline,
  permission,
  context,
});

export const MOCK_TOKEN = 'mock-token';

export const setUpParentWindow = ({ context } = {}) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = async (e) => {
    const { data } = e;

    const { type } = JSON.parse(data);

    switch (type) {
      case 'GET_AUTH_TOKEN':
        channel?.port1.postMessage(
          JSON.stringify({
            type: 'GET_AUTH_TOKEN_SUCCESS',
            payload: {
              token: MOCK_TOKEN,
            },
          })
        );
        break;
      default:
        console.log(`type '${type}' is not recognized`);
    }
  };
  cy.window().then((win) => {
    win.parent.postMessage = (message) => {
      const { type } = JSON.parse(message);
      if (type === 'GET_CONTEXT') {
        win.postMessage(
          JSON.stringify({
            type: 'GET_CONTEXT_SUCCESS',
            payload: buildMockLocalContext(context),
          }),
          '*',
          [channel.port2]
        );
      } else {
        console.log(`${type} is not recognised`);
      }
    };
  });

  // let some time to exchange context and token
  cy.wait(LOAD_PAGE_PAUSE);
};
