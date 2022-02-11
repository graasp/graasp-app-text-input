import React from 'react';
import ReactGa from 'react-ga';
import { I18nextProvider } from 'react-i18next';
import {
  MuiThemeProvider,
  createTheme,
  makeStyles,
} from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import 'react-toastify/dist/ReactToastify.css';
import i18nConfig from '../config/i18n';
import App from './App';
import {
  REACT_APP_GRAASP_APP_ID,
  REACT_APP_GRAASP_DEVELOPER_ID,
  REACT_APP_VERSION,
  REACT_APP_GOOGLE_ANALYTICS_ID,
} from '../config/env';
import { ContextProvider } from './context/ContextContext';
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';

// todo: to change
if (REACT_APP_GOOGLE_ANALYTICS_ID) {
  ReactGa.initialize(REACT_APP_GOOGLE_ANALYTICS_ID);
  ReactGa.ga(
    'send',
    'pageview',
    `/${REACT_APP_GRAASP_DEVELOPER_ID}/${REACT_APP_GRAASP_APP_ID}/${REACT_APP_VERSION}/`
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    height: '100%',
  },
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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <I18nextProvider i18n={i18nConfig}>
          <QueryClientProvider client={queryClient}>
            <ContextProvider>
              <App />
            </ContextProvider>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          </QueryClientProvider>
          <ToastContainer />
        </I18nextProvider>
      </MuiThemeProvider>
    </div>
  );
};

export default Root;
