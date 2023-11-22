import _ from 'lodash';
import { toast } from 'react-toastify';
import {
  FAILED_TO_FETCH_MESSAGE_RAW,
  FAILED_TO_FETCH_MESSAGE_PRETTY,
  UNEXPECTED_ERROR_MESSAGE,
} from '../constants/messages';

const showErrorToast = (payload: string | { message: string }) => {
  let message = UNEXPECTED_ERROR_MESSAGE;
  if (typeof payload === 'string') {
    message = payload;
  } else {
    if (payload.message) {
      ({ message } = payload);
    }
  }
  // provide more context
  if (message === FAILED_TO_FETCH_MESSAGE_RAW) {
    message = FAILED_TO_FETCH_MESSAGE_PRETTY;
  }

  toast.error(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

export { showErrorToast };
