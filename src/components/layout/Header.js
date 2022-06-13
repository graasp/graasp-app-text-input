import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { IconButton, styled } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { queryClient, QUERY_KEYS } from '../../config/queryClient';
import DownloadCsvButton from '../views/admin/DownloadCsvButton';
import { Context } from '@graasp/apps-query-client';
import { PERMISSION_LEVELS } from '../../config/settings';
import {
  appTitleCypress,
  logoCypress,
  refreshButtonCypress,
} from '../../config/selectors';

const StyledLogo = styled(Logo)(({ theme }) => ({
  height: '48px',
  marginRight: theme.spacing(2),
}));

const Header = () => {
  const { t } = useTranslation();
  const context = useContext(Context);

  const handleRefresh = () => {
    const itemId = context.get('itemId');
    queryClient.invalidateQueries(QUERY_KEYS.buildAppDataKey(itemId));
    queryClient.invalidateQueries(QUERY_KEYS.buildAppContextKey(itemId));
  };

  const renderViewButtons = () => {
    if (
      [PERMISSION_LEVELS.ADMIN, PERMISSION_LEVELS.WRITE].includes(
        context?.get('permission')
      )
    ) {
      return [
        <IconButton
          data-cy={refreshButtonCypress}
          onClick={handleRefresh}
          key="refresh"
        >
          <RefreshIcon color="secondary" />
        </IconButton>,
        <DownloadCsvButton />,
      ];
    }
    return null;
  };

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <StyledLogo data-cy={logoCypress} />
          <Typography
            data-cy={appTitleCypress}
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1 }}
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
