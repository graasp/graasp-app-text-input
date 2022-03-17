import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';
import { useMutation, MUTATION_KEYS } from '../../../config/queryClient';
import { Context } from '../../context/ContextContext';
import { useAppData } from '../../context/hooks';
import SaveButton from './SaveButton';
import { inputCypress, inputTextFieldId } from '../../../config/selectors';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';

const useStyles = makeStyles((theme) => ({
  main: {
    textAlign: 'center',
    flex: 1,
    padding: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
  },
  message: {
    padding: theme.spacing(1),
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
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
  const classes = useStyles();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [inputResource, setInputResource] = useState(null);
  const [feedbackResource, setFeedbackResource] = useState(null);
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation(MUTATION_KEYS.PATCH_APP_DATA);
  const { mutate: postAction } = useMutation('MUTATION_KEYS.POST_APP_DATA');

  const context = useContext(Context);
  const {
    data: appData,
    isLoading: isAppDataLoading,
    isSuccess: isAppDataSuccess,
  } = useAppData();

  useEffect(() => {
    if (isAppDataSuccess && !appData.isEmpty()) {
      //  suppose take first
      setInputResource(
        appData.find(({ type }) => type === APP_DATA_TYPES.INPUT)
      );
      setFeedbackResource(
        appData.find(({ type }) => type === APP_DATA_TYPES.FEEDBACK)
      );
    }

    // create this resource once data is loaded and is empty
    else if (isAppDataSuccess && appData.isEmpty()) {
      postAppData({ data: { text: '' }, type: APP_DATA_TYPES.INPUT });
    }
  }, [appData, isAppDataSuccess, postAppData]);

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
    // only save automatically if online and there is actually a memberId
    if (!context?.get('offline') && context?.get('memberId')) {
      saveToApi({ inputResource, patchAppData, data: value });
    }
  };

  const handleClickSaveText = () => {
    // if there is a resource id already, update, otherwise create
    if (inputResource?.id) {
      patchAppData({
        data: { text },
        id: inputResource.id,
      });
      postAction({
        verb: ACTION_TYPES.SAVED,
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
      <Grid item xs={12} className={classes.main}>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
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
            className={classes.textField}
            margin="normal"
            helperText={buildFeedbackText()}
            variant="outlined"
            fullWidth
          />
        </form>
        <SaveButton
          disabled={textIsDifferent}
          offline={context?.get('offline')}
          onClick={handleClickSaveText}
        />
      </Grid>
    </Grid>
  );
};

export default PlayerView;
