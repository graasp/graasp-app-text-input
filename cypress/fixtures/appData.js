import { v4 } from 'uuid';
import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER, MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from '../../src/config/settings';

const mockAppDataId = v4();
export const MOCK_APP_DATA = {
  id: mockAppDataId,
  data: { text: 'some text' },
  member: CURRENT_MEMBER,
  item: MOCK_SERVER_ITEM,
  createdAt: Date.now(),
  type: APP_DATA_TYPES.INPUT,
};
export const MOCK_APP_DATA_BOB = {
  id: mockAppDataId,
  data: { text: 'some text' },
  member: CURRENT_MEMBER,
  item: MOCK_SERVER_ITEM,
  createdAt: Date.now(),
  type: APP_DATA_TYPES.INPUT,
};

const mockFeedback = v4();
export const MOCK_FEEDBACK = {
  id: mockFeedback,
  data: { text: 'some feedback', memberId: CURRENT_MEMBER.id },
  member: MEMBERS.BOB,
  item: MOCK_SERVER_ITEM,
  createdAt: Date.now(),
  type: APP_DATA_TYPES.FEEDBACK,
};
