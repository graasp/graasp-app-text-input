import AdminView from './AdminView';
import PlayerView from '../read/PlayerView';
import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

const BuilderView = () => {
  const context = useLocalContext();
  switch (context.permission) {
    case PermissionLevel.Admin:
    case PermissionLevel.Write:
      return <AdminView />;

    case PermissionLevel.Read:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
