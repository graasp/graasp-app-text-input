import { useEffect } from 'react';
import i18n from '../config/i18n';
import { useLocalContext } from '@graasp/apps-query-client';
import AnalyzerView from './views/admin/AnalyzerView';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';
import { Context, DEFAULT_LANG } from '@graasp/sdk';

export const App = () => {
  const context = useLocalContext();

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
        return <BuilderView />;
      case Context.Analytics:
        return <AnalyzerView />;

      case Context.Player:
      default:
        return <PlayerView />;
    }
  };

  return renderContent();
};
export default App;
