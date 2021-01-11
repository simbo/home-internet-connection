import { Plugin } from '@hapi/hapi';

import { commonRoutes } from './common-routes';

export const commonPlugin: Plugin<{}> = {
  name: 'common',

  register: async (server): Promise<void> => {
    server.route(commonRoutes);
  }
};
