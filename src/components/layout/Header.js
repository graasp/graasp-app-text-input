import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    height: '48px',
    marginRight: theme.spacing(2),
  },
}));

const Header = () => {
  const classes = useStyles();
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
          <Logo data-cy={logoCypress} className={classes.logo} />
          <Typography
            data-cy={appTitleCypress}
            variant="h6"
            color="inherit"
            className={classes.grow}
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
