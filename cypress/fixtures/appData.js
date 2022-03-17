import { v4 } from 'uuid';
import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER, MEMBERS } from './members';

export const MOCK_SERVER_ITEM = { id: '1234567890' };

const mockAppDataId = v4();
export const MOCK_APP_DATA = {
  id: mockAppDataId,
  data: { text: 'some text' },
  memberId: CURRENT_MEMBER.id,
  itemId: MOCK_SERVER_ITEM.id,
  createdAt: Date.now(),
  type: APP_DATA_TYPES.INPUT,
};

const mockFeedback = v4();
export const MOCK_FEEDBACK = {
  id: mockFeedback,
  data: { text: 'some feedback', memberId: CURRENT_MEMBER.id },
  memberId: MEMBERS.BOB.id,
  itemId: MOCK_SERVER_ITEM.id,
  createdAt: Date.now(),
  type: APP_DATA_TYPES.FEEDBACK,
};
