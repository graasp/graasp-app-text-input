import { withContext, withToken } from '@graasp/apps-query-client';
import { styled } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const Wrapper = styled('div')({
  flexGrow: 1,
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
    secondary: { main: '#fff' },
    background: {
      paper: '#fff',
    },
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
