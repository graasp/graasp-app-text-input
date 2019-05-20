import { LOCAL_API_HOST } from './api';

export const MAX_INPUT_LENGTH = 5000;
export const MAX_ROWS = 10;
export const DEFAULT_LANG = 'en';
export const DEFAULT_MODE = 'student';
export const DEFAULT_API_HOST =
  window.parent.location.hostname === 'localhost' ? LOCAL_API_HOST : null;

// we haven't decided what to call the teacher mode
export const TEACHER_MODES = ['teacher', 'producer', 'educator', 'admin'];
