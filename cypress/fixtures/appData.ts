import { v4 } from 'uuid';
import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER, MEMBERS } from './members';
import { mockItem } from '@/mocks/db';
import { AppData, AppDataVisibility } from '@graasp/sdk';

export const MOCK_APP_DATA: AppData<{ text: string }> = {
  id: v4(),
  data: { text: 'some text' },
  member: CURRENT_MEMBER,
  creator: CURRENT_MEMBER,
  item: mockItem,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  visibility: AppDataVisibility.Member,
  type: APP_DATA_TYPES.INPUT,
};
export const MOCK_APP_DATA_BOB: AppData<{ text: string }> = {
  id: v4(),
  data: { text: 'some text from bob' },
  member: MEMBERS.BOB,
  creator: MEMBERS.BOB,
  item: mockItem,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  visibility: AppDataVisibility.Member,
  type: APP_DATA_TYPES.INPUT,
};

export const MOCK_FEEDBACK: AppData<{ text: string }> = {
  id: v4(),
  data: { text: 'some feedback' },
  member: MEMBERS.BOB,
  creator: CURRENT_MEMBER,
  item: mockItem,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  visibility: AppDataVisibility.Member,
  type: APP_DATA_TYPES.FEEDBACK,
};
