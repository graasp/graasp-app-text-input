import React, { useContext } from 'react';
import { Context } from '@graasp/apps-query-client';
import AdminView from './AdminView';
import { PERMISSION_LEVELS } from '../../../config/settings';
import PlayerView from '../read/PlayerView';

const BuilderView = () => {
  const context = useContext(Context);
  switch (context.get('permission')) {
    case PERMISSION_LEVELS.ADMIN:
    case PERMISSION_LEVELS.WRITE:
      return <AdminView />;

    case PERMISSION_LEVELS.READ:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
