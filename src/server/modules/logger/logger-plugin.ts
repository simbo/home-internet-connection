import { Plugin } from '@hapi/hapi';

import { logger } from './logger';

export const loggerPlugin: Plugin<{}> = {
  name: 'logger',

  register: async (server): Promise<void> => {
    server.events.on('log', (event, tags) => {
      if (tags.error) {
        logger.error(tags, event);
      } else {
        logger.log(tags, event);
      }
    });
  }
};
