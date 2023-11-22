import { useEffect } from 'react';
import Header from './layout/Header';
import i18n from '../config/i18n';
import { useLocalContext } from '@graasp/apps-query-client';
import AnalyzerView from './views/admin/AnalyzerView';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';
import { Context, DEFAULT_LANG } from '@graasp/sdk';
import { hooks } from '../config/queryClient';
import { SETTINGS } from '../config/settings';

export const App = () => {
  const context = useLocalContext();
  const { data: settings } = hooks.useAppSettings();
  const isHeaderVisible = settings?.find(
    ({ name }) => name === SETTINGS.HEADER_VISIBILITY
  )?.data[SETTINGS.HEADER_VISIBILITY];
  console.log('Context', context);
  useEffect(() => {
    // handle a change of language
    const lang = context?.lang ?? DEFAULT_LANG;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  const renderContent = () => {
    switch (context?.context) {
      case Context.Builder:
        return (
          <>
            <Header />
            <BuilderView />
          </>
        );
      case Context.Analytics:
        return (
          <>
            <Header />
            <AnalyzerView />
          </>
        );

      case Context.Player:
      default:
        return (
          <>
            {(context?.standalone || isHeaderVisible) && <Header />}
            <PlayerView />
          </>
        );
    }
  };

  return renderContent();
};
export default App;
