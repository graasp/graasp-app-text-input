import { configureQueryClient } from '@graasp/apps-query-client';
import { APP_KEY, ENABLE_MOCK_API, REACT_APP_API_HOST } from './settings';

if (!APP_KEY) {
  throw new Error('APP_KEY should be defined');
}

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
  mutations,
} = configureQueryClient({
  API_HOST: REACT_APP_API_HOST,
  notifier: (data) => {
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY: APP_KEY,
  isStandalone: ENABLE_MOCK_API,
  enableWebsocket: false,
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
