import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next';
import Loader from '../../common/Loader';
import { MUTATION_KEYS, useMutation } from '../../../config/queryClient';
import { headerVisibilityCypress } from '../../../config/selectors';
import { hooks } from '../../../config/queryClient';
import { SETTINGS } from '../../../config/settings';

const Settings = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const { data: settings, isLoading } = hooks.useAppSettings();
  const [headerVisibility, setHeaderVisibility] = useState(null);
  const { mutate: postAppSetting } = useMutation(
    MUTATION_KEYS.POST_APP_SETTING
  );
  const { mutate: patchAppSetting } = useMutation(
    MUTATION_KEYS.PATCH_APP_SETTING
  );

  useEffect(() => {
    if (settings && !settings.isEmpty()) {
      setHeaderVisibility(
        settings.find(({ name }) => name === SETTINGS.HEADER_VISIBILITY)
      );
    }
  }, [settings]);

  const handleChangeHeaderVisibility = () => {
    const settingsToChange = {
      [SETTINGS.HEADER_VISIBILITY]:
        !headerVisibility?.data?.[SETTINGS.HEADER_VISIBILITY],
    };
    if (headerVisibility) {
      patchAppSetting({ id: headerVisibility.id, data: settingsToChange });
    } else {
      postAppSetting({
        name: SETTINGS.HEADER_VISIBILITY,
        data: settingsToChange,
      });
    }
  };

  const renderModalContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    const switchControl = (
      <Switch
        data-cy={headerVisibilityCypress}
        color="primary"
        checked={headerVisibility?.data?.[SETTINGS.HEADER_VISIBILITY]}
        onChange={handleChangeHeaderVisibility}
        value={SETTINGS.HEADER_VISIBILITY}
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
  handleClose: () => {
    // do nothing
  },
};

export default Settings;
