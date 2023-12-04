import Grid from '@mui/material/Grid';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, styled } from '@mui/material';
import { useLocalContext } from '@graasp/apps-query-client';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';
import { mutations, hooks } from '../../../config/queryClient';
import SaveButton from './SaveButton';
import { inputCypress, inputTextFieldId } from '../../../config/selectors';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';

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
  const { data: appData, isLoading: isAppDataLoading } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: postAction } = mutations.usePostAppAction();

  const context = useLocalContext();
  const memberId = context.memberId;

  const appDataForMemberId = appData
    ?.filter(
      ({ type, creator }) =>
        type === APP_DATA_TYPES.INPUT && creator?.id === memberId
    )
    .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
  const inputResource =
    appDataForMemberId && appDataForMemberId[appDataForMemberId.length - 1];

  useEffect(() => {
    if (inputResource?.data.text) {
      setText(inputResource.data.text as string);
    }
  }, [inputResource]);

  if (appData) {
    const feedbackResource = appData.find(
      ({ type, member }) =>
        type === APP_DATA_TYPES.FEEDBACK && memberId === member?.id
    );

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
      <Grid container spacing={0}>
        <MainContainer item xs={12}>
          {Boolean(!memberId) && (
            <Alert severity="error">
              {t('You cannot answer if you are not authenticated')}
            </Alert>
          )}
          <FormContainer noValidate autoComplete="off">
            <StyledTextField
              autoFocus={context?.standalone}
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
          <SaveButton
            disabled={textIsDifferent}
            onClick={handleClickSaveText}
          />
        </MainContainer>
      </Grid>
    );
  }

  if (isAppDataLoading) {
    return <Loader />;
  }

  return <Alert severity="error">Could not get App Data</Alert>;
};

export default PlayerView;
