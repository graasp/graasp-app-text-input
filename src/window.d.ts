import { Database, LocalContext } from '@graasp/apps-query-client';

declare global {
  interface Window {
    appContext: LocalContext & { memberId: null };
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
