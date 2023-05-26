import {
  configureQueryClient,
  buildMockLocalContext,
  buildMockParentWindow,
} from '@graasp/apps-query-client';
import { REACT_APP_GRAASP_APP_KEY } from './env';
import { DEFAULT_LOCAL_CONTEXT, ENABLE_MOCK_API } from './settings';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  QUERY_KEYS,
} = configureQueryClient({
  notifier: (data) => {
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY: REACT_APP_GRAASP_APP_KEY,
  targetWindow: ENABLE_MOCK_API
    ? // build mock parent window given cypress context or mock data
    buildMockParentWindow(
      buildMockLocalContext(window.appContext ?? DEFAULT_LOCAL_CONTEXT)
    ) as Window
    : window.parent,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  QUERY_KEYS,
};
