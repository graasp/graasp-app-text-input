import AdminView from './AdminView';
import { PERMISSION_LEVELS } from '../../../config/settings';
import PlayerView from '../read/PlayerView';
import { useLocalContext } from '@graasp/apps-query-client';

const BuilderView = () => {
  const context = useLocalContext();
  switch (context.permission) {
    case PERMISSION_LEVELS.ADMIN:
    case PERMISSION_LEVELS.WRITE:
      return <AdminView />;

    case PERMISSION_LEVELS.READ:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
