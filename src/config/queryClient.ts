import { configureQueryClient } from '@graasp/apps-query-client';
import { REACT_APP_API_HOST, REACT_APP_GRAASP_APP_KEY } from './env';
import { ENABLE_MOCK_API } from './settings';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
  mutations,
} = configureQueryClient({
  API_HOST: REACT_APP_API_HOST!,
  notifier: (data) => {
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY: REACT_APP_GRAASP_APP_KEY!,
  isStandalone: ENABLE_MOCK_API,
});

export {
  queryClient,
  mutations,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
};
