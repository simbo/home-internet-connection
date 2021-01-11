import { ServerRoute } from '@hapi/hapi';

export const apiRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/foo',
    handler: async (request, h) => {
      return {};
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return {};
    }
  }
];
