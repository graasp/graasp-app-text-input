import React, { useContext } from 'react';
import Header from './layout/Header';
import { TokenProvider } from './context/TokenContext';
import { Context } from './context/ContextContext';
import AnalyzerView from './views/admin/AnalyzerView';
import { CONTEXTS } from '../config/contexts';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';

export const App = () => {
  const context = useContext(Context);

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
        return <AnalyzerView />;

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

  return <TokenProvider>{renderContent()}</TokenProvider>;
};

export default App;
