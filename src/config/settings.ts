import { Context, DEFAULT_LANG, PermissionLevel } from '@graasp/sdk';
import { REACT_APP_ENABLE_MOCK_API } from './env';

export const MAX_INPUT_LENGTH = 5000;
export const MAX_ROWS = 10;

// todo: remove when all files are in ts
export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};
export const DEFAULT_PERMISSION = PermissionLevel.Read;

export const DEFAULT_VISIBILITY = 'private';
export const PUBLIC_VISIBILITY = 'public';

export const RESPONSES_COLUMNS = ['Student', 'Input', 'Feedback', 'Actions'];

export const REACT_APP_API_HOST =
  process.env.REACT_APP_API_HOST ?? 'http://localhost:3000';

export const DEFAULT_LOCAL_CONTEXT = {
  permission: PermissionLevel.Read,
  lang: DEFAULT_LANG,
  context: Context.Player,
  apiHost: REACT_APP_API_HOST,
};

export const ENABLE_MOCK_API = REACT_APP_ENABLE_MOCK_API === 'true';

export const SETTINGS = {
  HEADER_VISIBILITY: 'headerVisibility',
};
