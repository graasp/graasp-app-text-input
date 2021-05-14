import { createServer, Model, Factory, RestSerializer } from 'miragejs';
import { API_ROUTES } from './queryClient';
import { v4 } from 'uuid';

const DEFAULT_MEMBER = { id: v4() };

const {
  buildGetAppDataRoute,
  buildGetContextRoute,
  buildPostAppDataRoute,
  buildPatchAppDataRoute,
  buildDeleteAppDataRoute,
  buildPatchSettingsRoute,
} = API_ROUTES;

export const arrayToJS = (collection) =>
  collection.models.map((m) => ({ ...m.attrs }));

const ApplicationSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

const DEFAULT_DATABASE = {
  currentMember: DEFAULT_MEMBER,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ database } = DEFAULT_DATABASE) {
  const db = { ...DEFAULT_DATABASE, ...database };
  const { currentMember, currentItemId, appData, members } = db;

  // we cannot use *Data
  // https://github.com/miragejs/miragejs/issues/782
  return createServer({
    // environment
    urlPrefix: process.env.REACT_APP_API_HOST,
    models: {
      appDataResource: Model,
      member: Model,
    },
    factories: {
      appDataResource: Factory.extend({
        createdAt: Date.now(),
        settings: {},
        data: (attrs) => {
          return attrs.data;
        },
        type: (attrs) => {
          return attrs.type;
        },
        id: (attrs) => {
          return attrs?.id ?? v4();
        },
        itemId: currentItemId,
        memberId: currentMember.id,
      }),
      member: Factory.extend({
        id: (attrs) => {
          return attrs?.id ?? v4();
        },
      }),
    },

    serializers: {
      appDataResource: ApplicationSerializer,
      member: ApplicationSerializer,
    },
    seeds(server) {
      server.create('member', currentMember);
      appData?.forEach((d) => {
        server.create('appDataResource', d);
      });
      members?.forEach((m) => {
        server.create('member', m);
      });
    },
    routes() {
      // app data
      this.get(`/${buildGetAppDataRoute(currentItemId)}`, (schema) => {
        return schema.appDataResources.all();
      });
      this.post(
        `/${buildPostAppDataRoute({ itemId: currentItemId })}`,
        (schema, request) => {
          const { requestBody } = request;
          const data = JSON.parse(requestBody);
          return schema.appDataResources.create({
            ...data,
            itemId: currentItemId,
            memberId: currentMember.id,
          });
        }
      );
      this.patch(
        `/${buildPatchAppDataRoute({ itemId: currentItemId, id: ':id' })}`,
        (schema, request) => {
          const { id } = request.params;
          const { requestBody } = request;
          const data = JSON.parse(requestBody);
          const a = schema.appDataResources.findBy({ id });
          return a.update({ ...a.attrs, ...data });
        }
      );
      this.delete(
        `/${buildDeleteAppDataRoute({ itemId: currentItemId, id: ':id' })}`,
        (schema, request) => {
          const { id } = request.params;
          const appData = schema.appDataResources.findBy({ id });
          return appData.destroy();
        }
      );

      // context
      this.get(`/${buildGetContextRoute(currentItemId)}`, (schema) => {
        return {
          members: schema.members.all().models,
        };
      });

      // settings
      this.patch(
        `/${buildPatchSettingsRoute({ itemId: currentItemId })}`,
        (schema, request) => {
          // query client edits the context
          const { requestBody } = request;
          const data = JSON.parse(requestBody);
          return data;
        }
      );
    },
  });
}
