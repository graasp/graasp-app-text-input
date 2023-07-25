import Grid from '@mui/material/Grid';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, styled } from '@mui/material';
import { useLocalContext } from '@graasp/apps-query-client';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';
import { mutations } from '../../../config/queryClient';
import { hooks } from '../../../config/queryClient';
import SaveButton from './SaveButton';
import { inputCypress, inputTextFieldId } from '../../../config/selectors';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { AppDataRecord } from '@graasp/sdk/frontend';

const FormContainer = styled('form')({
  display: 'flex',
  flexWrap: 'wrap',
  overflowX: 'hidden',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  flex: 1,
  padding: theme.spacing(1),
}));

const PlayerView = (): JSX.Element => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [inputResource, setInputResource] = useState<AppDataRecord>();
  const [feedbackResource, setFeedbackResource] = useState<AppDataRecord>();
  const rootRef = useRef(null);
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: postAction } = mutations.usePostAppAction();

  const context = useLocalContext();
  const memberId = context?.memberId;
  const {
    data: appData,
    isLoading: isAppDataLoading,
    isSuccess: isAppDataSuccess,
  } = hooks.useAppData();

  useEffect(() => {
    if (isAppDataSuccess) {
      // for security we get the latest of all the app data
      const appDataForMemberId = appData
        .filter(
          ({ type, creator }) =>
            type === APP_DATA_TYPES.INPUT && creator?.id === memberId
        )
        .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
      const data = appDataForMemberId.last();

      if (data) {
        setInputResource(data);
        const feedback = appData.find(
          ({ type, member }) =>
            type === APP_DATA_TYPES.FEEDBACK && memberId === member?.id
        );
        if (feedback) {
          setFeedbackResource(feedback);
        }
      }
    }
  }, [context, appData, isAppDataSuccess, memberId]);

  useEffect(() => {
    if (inputResource) {
      setText(inputResource.data.text as string);
    }
  }, [inputResource]);

  if (!context?.get('standalone') && isAppDataLoading) {
    return <Loader />;
  }

  const handleChangeText: TextFieldProps['onChange'] = ({ target }) => {
    const { value } = target;
    setText(value);
  };

  const handleClickSaveText = () => {
    // if there is a resource id already, update, otherwise create
    if (inputResource?.id) {
      patchAppData({
        data: { text },
        id: inputResource.id,
      });
      postAction({
        type: ACTION_TYPES.SAVED,
        data: {
          data: text,
          id: inputResource.id,
        },
      });
    } else {
      postAppData({
        data: { text },
        type: APP_DATA_TYPES.INPUT,
      });
    }
  };

  const buildFeedbackText = () => {
    if (feedbackResource) {
      return `${t('Feedback')}: ${feedbackResource.data?.text}`;
    }
    return null;
  };

  const textIsDifferent = text === inputResource?.data?.text;

  return (
    <Grid container spacing={0} ref={rootRef}>
      <MainContainer item xs={12}>
        {Boolean(!memberId) && (
          <Alert severity="error">
            {t('You cannot answer if you are not authenticated')}
          </Alert>
        )}
        <FormContainer noValidate autoComplete="off">
          <StyledTextField
            autoFocus={context?.get('standalone')}
            inputProps={{
              maxLength: MAX_INPUT_LENGTH,
            }}
            disabled={Boolean(!memberId)}
            data-cy={inputCypress}
            id={inputTextFieldId}
            label={t('Type Here')}
            multiline
            maxRows={MAX_ROWS}
            value={text}
            onChange={handleChangeText}
            margin="normal"
            helperText={buildFeedbackText()}
            variant="outlined"
            fullWidth
          />
        </FormContainer>
        <SaveButton disabled={textIsDifferent} onClick={handleClickSaveText} />
      </MainContainer>
    </Grid>
  );
};

export default PlayerView;
