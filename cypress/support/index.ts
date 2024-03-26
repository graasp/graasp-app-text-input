import { Database, LocalContext } from '@graasp/apps-query-client';
export type SetupAPI = {
  database?: Partial<Database>;
  appContext?: Partial<LocalContext | { memberId: string | null }>;
};
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setUpApi(value?: SetupAPI): Chainable<JQuery<HTMLElement>>;
      enterStudentResponse(value: string): Chainable<JQuery<HTMLElement>>;
      clearStudentResponse(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
