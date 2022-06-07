import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { saveButtonCypress } from '../../../config/selectors';

const Container = styled('div')(({ theme }) => ({
  textAlign: 'right',
  marginRight: theme.spacing(1),
}));

function SaveButton({ offline, disabled, onClick }) {
  const { t } = useTranslation();

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
    <Container>{disabled ? withTooltip(saveButton) : saveButton}</Container>
  );
}

export default SaveButton;
