import { Fragment, useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next';
import Loader from '../../common/Loader';
import { mutations } from '../../../config/queryClient';
import { headerVisibilityCypress } from '../../../config/selectors';
import { hooks } from '../../../config/queryClient';
import { SETTINGS } from '../../../config/settings';
import { AppSettingRecord } from '@graasp/sdk/frontend';

type Props = {
  open?: boolean;
  handleClose?: DialogProps['onClose'];
};

const Settings = ({ open = false, handleClose }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { data: settings, isLoading } = hooks.useAppSettings();
  const [headerVisibility, setHeaderVisibility] = useState<AppSettingRecord>();
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();

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
        checked={
          headerVisibility?.data?.[SETTINGS.HEADER_VISIBILITY] as boolean
        }
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

export default Settings;
