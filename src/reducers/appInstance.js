import _ from 'lodash';
import {
  GET_APP_INSTANCE_FAILED,
  GET_APP_INSTANCE_SUCCEEDED,
  PATCH_APP_INSTANCE_FAILED,
  PATCH_APP_INSTANCE_SUCCEEDED,
} from '../types/appInstance';
import { showErrorToast } from '../utils/toasts';

const DEFAULT_SETTINGS = {
  headerVisible: true,
  badgeGroup: 0,
};

const INITIAL_STATE = {
  settings: DEFAULT_SETTINGS,
  ready: false,
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case GET_APP_INSTANCE_SUCCEEDED:
    case PATCH_APP_INSTANCE_SUCCEEDED:
      // back to defaults if settings are empty
      if (!payload.settings || _.isEmpty(payload.settings)) {
        return {
          ...payload,
          settings: DEFAULT_SETTINGS,
          // mark instance as ready
          ready: true,
        };
      }
      return {
        ...payload,
        // mark instance as ready
        ready: true,
      };

    case PATCH_APP_INSTANCE_FAILED:
    case GET_APP_INSTANCE_FAILED:
      // show error to user
      showErrorToast(payload);
      return state;

    default:
      return state;
  }
};
