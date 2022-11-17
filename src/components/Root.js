import { withContext, withToken } from '@graasp/apps-query-client';
import { styled } from '@mui/material';
import grey from '@mui/material/colors/grey';
import orange from '@mui/material/colors/orange';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactGa from 'react-ga';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  REACT_APP_GOOGLE_ANALYTICS_ID,
  REACT_APP_GRAASP_APP_ID,
  REACT_APP_GRAASP_DEVELOPER_ID,
  REACT_APP_VERSION,
} from '../config/env';
import i18nConfig from '../config/i18n';
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';
import App from './App';
import Loader from './common/Loader';

import { hooks } from '../config/queryClient';
import { showErrorToast } from '../utils/toasts';

// todo: to change
if (REACT_APP_GOOGLE_ANALYTICS_ID) {
  ReactGa.initialize(REACT_APP_GOOGLE_ANALYTICS_ID);
  ReactGa.ga(
    'send',
    'pageview',
    `/${REACT_APP_GRAASP_DEVELOPER_ID}/${REACT_APP_GRAASP_APP_ID}/${REACT_APP_VERSION}/`
  );
}

const Wrapper = styled('div')({
  flexGrow: 1,
  height: '100%',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
    secondary: { main: '#fff' },
    default: grey,
    background: {
      paper: '#fff',
    },
  },
  status: {
    danger: {
      background: orange,
      color: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const Root = () => {
  const AppWithContext = withToken(App, {
    LoadingComponent: <Loader />,
    useAuthToken: hooks.useAuthToken,
    onError: () => {
      showErrorToast('An error occured while requesting the token.');
    },
  });

  const AppWithContextAndToken = withContext(AppWithContext, {
    LoadingComponent: <Loader />,
    useGetLocalContext: hooks.useGetLocalContext,
    useAutoResize: hooks.useAutoResize,
    onError: () => {
      showErrorToast('An error occured while fetching the context.');
    },
  });

  return (
    <Wrapper>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18nConfig}>
          <QueryClientProvider client={queryClient}>
            <AppWithContextAndToken />
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          </QueryClientProvider>
          <ToastContainer />
        </I18nextProvider>
      </ThemeProvider>
    </Wrapper>
  );
};

export default Root;
