import { server as hapiServer, Server } from '@hapi/hapi';

import { serverOptions } from './server-options';
import { registerPlugins } from './server-plugins';
import { getViewManagerConfig } from './view-manager';

export async function startServer(): Promise<Server> {
  const server = hapiServer(serverOptions);
  await registerPlugins(server);
  server.views(await getViewManagerConfig());
  await server.start();
  return server;
}
