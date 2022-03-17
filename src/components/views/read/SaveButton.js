import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import { saveButtonCypress } from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));
function SaveButton({ offline, disabled, onClick }) {
  const { t } = useTranslation();
  const classes = useStyles();

  // button is only visible offline
  if (!offline) {
    return null;
  }

  const withTooltip = (elem) => {
    return (
      <Tooltip title={t('All changes saved.')}>
        <span>{React.cloneElement(elem)}</span>
      </Tooltip>
    );
  };

  const saveButton = (
    <Button
      data-cy={saveButtonCypress}
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {t('Save')}
    </Button>
  );

  return (
    <div align="right" className={classes.button}>
      {disabled ? withTooltip(saveButton) : saveButton}
    </div>
  );
}

export default SaveButton;
