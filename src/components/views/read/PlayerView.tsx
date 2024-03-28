import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, styled } from '@mui/material';
import { useLocalContext } from '@graasp/apps-query-client';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';
import { mutations, hooks } from '../../../config/queryClient';
import SaveButton from './SaveButton';
import {
  inputCypress,
  inputTextFieldId,
  publicAlertBannerIdCypress,
} from '../../../config/selectors';
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

type PlayerViewComponentProps = {
  isLoggedIn: boolean;
  isSaveButtonDisabled: boolean;
  text: string;
  onChangeText?: (value: string) => void;
  onSave?: () => void;
  helperText?: string;
  autoFocusTextField?: boolean;
};

const PlayerViewComponent = ({
  isLoggedIn,
  isSaveButtonDisabled,
  text,
  onChangeText,
  onSave,
  helperText,
  autoFocusTextField = false,
}: PlayerViewComponentProps) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={0}>
      <MainContainer item xs={12}>
        {!isLoggedIn && (
          <Alert severity="error" id={publicAlertBannerIdCypress}>
            {t(
              'You cannot answer if you are not authenticated. Please log in.'
            )}
          </Alert>
        )}
        <FormContainer noValidate autoComplete="off">
          <StyledTextField
            autoFocus={autoFocusTextField}
            inputProps={{
              maxLength: MAX_INPUT_LENGTH,
            }}
            disabled={!isLoggedIn}
            data-cy={inputCypress}
            id={inputTextFieldId}
            label={t('Type Here')}
            multiline
            maxRows={MAX_ROWS}
            value={text}
            onChange={(e) => onChangeText?.(e.target.value)}
            margin="normal"
            helperText={helperText}
            variant="outlined"
            fullWidth
          />
        </FormContainer>
        <SaveButton disabled={isSaveButtonDisabled} onClick={onSave} />
      </MainContainer>
    </Grid>
  );
};

const PlayerView = (): JSX.Element => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const {
    data: appData,
    isLoading: isAppDataLoading,
    isSuccess: isAppDataSuccess,
  } = hooks.useAppData();
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

  if (appData || isAppDataSuccess) {
    const feedbackResource = appData?.find(
      ({ type, member }) =>
        type === APP_DATA_TYPES.FEEDBACK && memberId === member?.id
    );
    const handleChangeText = (value: string) => {
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
      return undefined;
    };

    const textIsDifferent = text === inputResource?.data?.text;

    return (
      <PlayerViewComponent
        text={text}
        helperText={buildFeedbackText()}
        onChangeText={handleChangeText}
        onSave={handleClickSaveText}
        isSaveButtonDisabled={textIsDifferent}
        isLoggedIn={Boolean(memberId)}
        autoFocusTextField={context?.standalone}
      />
    );
  }

  if (isAppDataLoading) {
    return <Loader />;
  }

  return (
    <PlayerViewComponent
      text=""
      helperText={t('You need to login to use this app')}
      isSaveButtonDisabled
      isLoggedIn={false}
    />
  );
};

export default PlayerView;
