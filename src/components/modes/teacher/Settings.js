import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';
import { Context } from '../../context/ContextContext';
import { MUTATION_KEYS, useMutation } from '../../../config/queryClient';
import { headerVisibilityCypress } from '../../../config/selectors';

const Settings = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const context = useContext(Context);
  const { mutate: patchSettings } = useMutation(MUTATION_KEYS.PATCH_SETTINGS);

  const saveSettings = (settingsToChange) => {
    patchSettings(settingsToChange);
  };

  const handleChangeHeaderVisibility = () => {
    const settingsToChange = {
      headerVisible: !context?.get('settings')?.headerVisible,
    };
    saveSettings(settingsToChange);
  };

  const renderModalContent = () => {
    const switchControl = (
      <Switch
        data-cy={headerVisibilityCypress}
        color="primary"
        checked={context?.get('settings')?.headerVisible}
        onChange={handleChangeHeaderVisibility}
        value="headerVisibility"
      />
    );

    return (
      <Fragment>
        <FormControlLabel
          control={switchControl}
          label={t('Show Header to Students')}
        />
      </Fragment>
    );
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">{t('Settings')}</DialogTitle>
      <DialogContent>{renderModalContent()}</DialogContent>
    </Dialog>
  );
};

Settings.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

Settings.defaultProps = {
  open: false,
  handleClose: () => {},
};

export default Settings;
