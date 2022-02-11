export const saveButtonCypress = 'saveButton';
export const inputCypress = 'input';
export const inputTextFieldId = 'inputTextField';
export const inputTextFieldSelector = `[data-cy=${inputCypress}] textarea#${inputTextFieldId}`;
export const appTitleCypress = 'appTitle';
export const refreshButtonCypress = 'refreshButton';
export const logoCypress = 'logo';
export const settingsButtonCypress = 'settingsButton';
export const settingsModalCypress = 'settingsModal';
export const responsesTableCypress = 'responses';
export const headerVisibilityCypress = 'headerVisibility';
export const headerVisibility = `[data-cy=${headerVisibilityCypress}] input`;
export const wordCloudId = 'wordCloud';
export const feedbackTextCypress = 'feedbackText';
export const tableNoResponsesCypress = 'tableNoResponses';
export const deleteButtonCypress = 'deleteButton';
export const editFeedbackButtonCypress = 'editFeedbackButton';
export const feedbackInputCypress = 'feedbackInput';
export const submitButtonCypress = 'submitButton';
export const deleteConfirmButtonCypress = 'deleteConfirmButton';

export const dataCyWrapper = (cypressSelector) =>
  `[data-cy=${cypressSelector}]`;