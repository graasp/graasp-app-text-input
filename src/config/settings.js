import { CONTEXTS } from './contexts';
import { REACT_APP_API_HOST, REACT_APP_MOCK_API } from './env';

export const MAX_INPUT_LENGTH = 5000;
export const MAX_ROWS = 10;
export const DEFAULT_LANG = 'en';
export const ADAPT_HEIGHT_TIMEOUT = 50;

// todo: use from graasp constants
export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};
export const DEFAULT_PERMISSION = PERMISSION_LEVELS.READ;

export const DEFAULT_VISIBILITY = 'private';
export const PUBLIC_VISIBILITY = 'public';

export const RESPONSES_COLUMNS = ['Student', 'Input', 'Feedback', 'Actions'];

export const DEFAULT_LOCAL_CONTEXT = {
  permission: PERMISSION_LEVELS.READ,
  lang: DEFAULT_LANG,
  context: CONTEXTS.PLAYER,
  apiHost: REACT_APP_API_HOST,
};

export const ENABLE_MOCK_API = REACT_APP_MOCK_API === 'true';

export const SETTINGS = {
  HEADER_VISIBILITY: 'headerVisibility',
};
