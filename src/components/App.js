import React, { useContext, useEffect } from 'react';
import Header from './layout/Header';
import { DEFAULT_LANG } from '../config/settings';
import i18n from '../config/i18n';
import { TokenProvider, Context } from '@graasp/apps-query-client';
import AnalyzerView from './views/admin/AnalyzerView';
import { CONTEXTS } from '../config/contexts';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';
import { hooks } from '../config/queryClient';
import { showErrorToast } from '../utils/toasts';
import Loader from './common/Loader';

export const App = () => {
  const context = useContext(Context);

  useEffect(() => {
    // handle a change of language
    const lang = context?.get('lang') ?? DEFAULT_LANG;
    if (i18n.lang !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  const renderContent = () => {
    switch (context?.get('context')) {
      case CONTEXTS.BUILDER:
        return (
          <>
            <Header />
            <BuilderView />
          </>
        );
      case CONTEXTS.ANALYZER:
        return (
          <>
            <Header />
            <AnalyzerView />
          </>
        );

      case CONTEXTS.PLAYER:
      default:
        return (
          <>
            {context?.get('standalone') && <Header />}
            <PlayerView />
          </>
        );
    }
  };

  return (
    <TokenProvider
      LoadingComponent={<Loader />}
      useAuthToken={hooks.useAuthToken}
      onError={() => {
        showErrorToast('An error occured while requesting the token.');
      }}
    >
      {renderContent()}
    </TokenProvider>
  );
};

export default App;
