import { PermissionLevel } from '@graasp/sdk';

export const MAX_INPUT_LENGTH = 5000;
export const MAX_ROWS = 10;

// todo: remove when all files are in ts
export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};
export const DEFAULT_PERMISSION = PermissionLevel.Read;

export const RESPONSES_COLUMNS = ['Student', 'Input', 'Feedback', 'Actions'];

export const MOCK_ITEM_ID = '1234-1234-123456-8123-123456';

export const SETTINGS = {
  HEADER_VISIBILITY: 'headerVisibility',
};
