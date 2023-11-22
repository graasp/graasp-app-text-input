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

type SaveButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

const SaveButton = ({ disabled, onClick }: SaveButtonProps) => {
  const { t } = useTranslation();

  const withTooltip = (elem: JSX.Element) => {
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
};

export default SaveButton;
