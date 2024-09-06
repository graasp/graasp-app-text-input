import { UpdateArgument, useObjectState } from '@graasp/apps-query-client';
import { createContext, useContext } from 'react';

export type SettingsType = {
  useRelativeTime: boolean;
};

type TableSettingsContextType = {
  settings: SettingsType;
  setSettings: ReturnType<typeof useObjectState<SettingsType>>[1];
};

const DEFAULT_SETTINGS_VALUE: SettingsType = {
  useRelativeTime: false,
};

const TableSettingsContext = createContext<TableSettingsContextType>({
  settings: DEFAULT_SETTINGS_VALUE,
  setSettings: (_: UpdateArgument<SettingsType>) => {
    return null;
  },
});

export const TableSettingsContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [settings, setSettings] = useObjectState(DEFAULT_SETTINGS_VALUE);
  return (
    <TableSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </TableSettingsContext.Provider>
  );
};
export const useTableSettingsContext = () => useContext(TableSettingsContext);
