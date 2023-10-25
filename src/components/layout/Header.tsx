import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { queryClient, QUERY_KEYS } from '../../config/queryClient';
import DownloadCsvButton from '../views/admin/DownloadCsvButton';
import { useLocalContext } from '@graasp/apps-query-client';
import { GraaspLogo } from '@graasp/ui';
import { appTitleCypress, refreshButtonCypress } from '../../config/selectors';
import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

const Header = () => {
  const { t } = useTranslation();
  const context = useLocalContext();

  const handleRefresh = () => {
    const itemId = context.itemId;
    queryClient.invalidateQueries(QUERY_KEYS.buildAppDataKey(itemId));
    queryClient.invalidateQueries(QUERY_KEYS.buildAppContextKey(itemId));
  };

  const renderViewButtons = () => {
    if (
      context?.permission &&
      PermissionLevelCompare.gte(context.permission, PermissionLevel.Write)
    ) {
      return [
        <IconButton
          data-cy={refreshButtonCypress}
          onClick={handleRefresh}
          key="refresh"
        >
          <RefreshIcon color="secondary" />
        </IconButton>,
        <DownloadCsvButton key="download-csv" />,
      ];
    }
    return null;
  };

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <GraaspLogo sx={{ fill: 'white' }} height={48} />
          <Typography
            data-cy={appTitleCypress}
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1, marginLeft: 1 }}
          >
            {t('Text Input')}
          </Typography>
          {renderViewButtons()}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
