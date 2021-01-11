import { Plugin } from '@hapi/hapi';

import { connect, disconnect } from './database';

export const databasePlugin: Plugin<{}> = {
  name: 'database',

  register: async (server): Promise<void> => {
    server.events.on('start', async () => connect());
    server.events.on('stop', async () => disconnect());
  }
};
