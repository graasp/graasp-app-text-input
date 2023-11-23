import {
  GraaspContextDevTool,
  useObjectState,
  WithLocalContext,
  WithTokenContext,
} from '@graasp/apps-query-client';
import { styled } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
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
import { theme } from '@graasp/ui';
import { defaultMockContext, mockMembers } from '../mocks/db';

const Wrapper = styled('div')({
  flexGrow: 1,
});

const Root = () => {
  const [mockContext, setMockContext] = useObjectState(defaultMockContext);

  return (
    <Wrapper>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18nConfig}>
          <QueryClientProvider client={queryClient}>
            <WithLocalContext
              LoadingComponent={<Loader />}
              useGetLocalContext={hooks.useGetLocalContext}
              useAutoResize={hooks.useAutoResize}
              onError={(err) => {
                showErrorToast('An error occurred while fetching the context.');
                console.log('Local Context err', err);
              }}
              defaultValue={window.Cypress ? window.appContext : mockContext}
            >
              <WithTokenContext
                LoadingComponent={<Loader />}
                useAuthToken={hooks.useAuthToken}
                onError={(err) => {
                  showErrorToast(
                    'An error occurred while requesting the token.'
                  );
                  console.log('token context err', err);
                }}
              >
                <App />
                {import.meta.env.DEV && (
                  <GraaspContextDevTool
                    members={mockMembers}
                    context={mockContext}
                    setContext={setMockContext}
                  />
                )}
              </WithTokenContext>
            </WithLocalContext>
            {import.meta.env.DEV && <ReactQueryDevtools />}
          </QueryClientProvider>
          <ToastContainer />
        </I18nextProvider>
      </ThemeProvider>
    </Wrapper>
  );
};

export default Root;
