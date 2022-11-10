import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material';
import { Context } from '@graasp/apps-query-client';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';
import { useMutation, MUTATION_KEYS } from '../../../config/queryClient';
import { hooks } from '../../../config/queryClient';
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

const saveToApi = _.debounce(({ inputResource, patchAppData, data }) => {
  if (inputResource) {
    patchAppData({
      data: { text: data },
      id: inputResource.id,
    });
  }
}, 1000);

const PlayerView = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [inputResource, setInputResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation(MUTATION_KEYS.PATCH_APP_DATA);
  const { mutate: postAction } = useMutation(MUTATION_KEYS.POST_APP_ACTION);

  const context = useContext(Context);
  const {
    data: appData,
    isLoading: isAppDataLoading,
    isSuccess: isAppDataSuccess,
  } = hooks.useAppData();

  useEffect(() => {
    if (isAppDataSuccess) {
      const memberId = context?.get('memberId');
      const data = appData.find(
        ({ type, creator }) =>
          type === APP_DATA_TYPES.INPUT && creator === memberId
      );
      if (data) {
        setInputResource(data);
        setFeedbackResource(
          appData.find(
            ({ type, memberId: thisMId }) =>
              type === APP_DATA_TYPES.FEEDBACK && memberId === thisMId
          )
        );
      }
      // // create resource if no input exists
      // else {
      //   postAppData({ data: { text: '' }, type: APP_DATA_TYPES.INPUT });
      // }
    }
  }, [context, appData, isAppDataSuccess, postAppData]);

  useEffect(() => {
    if (inputResource) {
      setText(inputResource.data.text);
    }
  }, [inputResource]);

  if (!context?.get('standalone') && isAppDataLoading) {
    return <Loader />;
  }

  const handleChangeText = ({ target }) => {
    const { value } = target;
    setText(value);
    // // only save automatically if online and there is actually a memberId
    // if (!context?.get('offline') && context?.get('memberId')) {
    //   saveToApi({ inputResource, patchAppData, data: value });
    // }
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
        <FormContainer noValidate autoComplete="off">
          <StyledTextField
            autoFocus={context?.get('standalone')}
            inputProps={{
              maxLength: MAX_INPUT_LENGTH,
            }}
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
