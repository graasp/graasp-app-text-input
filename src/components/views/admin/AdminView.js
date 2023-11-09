import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Loader from '../../common/Loader';
import Responses from './Responses';
import Settings from './Settings';
import { hooks } from '../../../config/queryClient';
import { settingsButtonCypress } from '../../../config/selectors';

const Container = styled(Grid)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  backgroundColor: '#fff',
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  overflowX: 'hidden',
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  margin: theme.spacing(1),
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

export const AdminView = () => {
  const { t } = useTranslation();
  const { data: context, isLoading } = hooks.useAppContext();
  const { data: appData, isLoading: isAppDataLoading } = hooks.useAppData();
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  if (isLoading || isAppDataLoading) {
    return <Loader />;
  }

  const members = context?.members ?? [];

  const onClick = () => {
    setIsOpenSettings(true);
  };
  const handleClose = () => {
    setIsOpenSettings(false);
  };

  return (
    <>
      <Container container spacing={0}>
        <MainContainer item xs={12}>
          <Responses students={members} appData={appData} />
        </MainContainer>
      </Container>
      <Settings open={isOpenSettings} handleClose={handleClose} />
      <StyledFab
        data-cy={settingsButtonCypress}
        color="primary"
        aria-label={t('Settings')}
        onClick={onClick}
      >
        <SettingsIcon />
      </StyledFab>
    </>
  );
};

export default AdminView;
