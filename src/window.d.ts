import { Database } from '@graasp/apps-query-client';
import { LocalContext } from '@graasp/sdk';

declare global {
  interface Window {
    appContext: LocalContext;
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
