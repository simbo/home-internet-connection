import { Plugin } from '@hapi/hapi';

import { apiRoutes } from './api-routes';

export const apiPlugin: Plugin<{}> = {
  name: 'api',

  register: async (server): Promise<void> => {
    server.route(apiRoutes);
  }
};
