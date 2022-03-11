import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import Loader from '../../common/Loader';
import Responses from './Responses';
import Settings from './Settings';
import { useAppContext, useAppData } from '../../context/hooks';
import { settingsButtonCypress } from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    backgroundColor: '#fff',
  },
  main: {
    textAlign: 'center',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    overflowX: 'hidden',
  },
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const TeacherView = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: context, isLoading } = useAppContext();
  const { data: appData, isLoading: isAppDataLoading } = useAppData();
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  if (isLoading || isAppDataLoading) {
    return <Loader />;
  }

  const members = context?.get('members') ?? [];

  const onClick = () => {
    setIsOpenSettings(true);
  };
  const handleClose = () => {
    setIsOpenSettings(false);
  };

  return (
    <>
      <Grid container spacing={0} className={classes.root}>
        <Grid item xs={12} className={classes.main}>
          <Responses students={members} appData={appData} />
        </Grid>
      </Grid>
      <Settings open={isOpenSettings} handleClose={handleClose} />
      <Fab
        data-cy={settingsButtonCypress}
        color="primary"
        aria-label={t('Settings')}
        className={classes.fab}
        onClick={onClick}
      >
        <SettingsIcon />
      </Fab>
    </>
  );
};

export default TeacherView;
