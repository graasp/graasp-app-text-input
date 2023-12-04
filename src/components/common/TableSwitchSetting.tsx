import {
  SettingsType,
  useTableSettingsContext,
} from '@/context/TableSettingsContext';
import { FormControlLabel, Switch } from '@mui/material';

type Props = {
  label: string;
  settingKey: keyof SettingsType;
};

const TableSwitchSetting = ({ label, settingKey }: Props) => {
  const { settings, setSettings } = useTableSettingsContext();
  return (
    <FormControlLabel
      label={label}
      labelPlacement="start"
      control={
        <Switch
          checked={settings[settingKey]}
          onChange={(_, checked) =>
            setSettings(() => ({ [settingKey]: checked }))
          }
        />
      }
    />
  );
};

export default TableSwitchSetting;
