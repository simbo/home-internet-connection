import { Plugin, Server, ServerRegisterOptions } from '@hapi/hapi';
import * as inert from '@hapi/inert';
import * as vision from '@hapi/vision';

import { apiPlugin } from '../api/api-plugin';
import { commonPlugin } from '../common/common-plugin';
import { databasePlugin } from '../database/database-plugin';
import { loggerPlugin } from '../logger/logger-plugin';

type PluginOptions = any;
type PluginRegistration =
  | Plugin<PluginOptions>
  | [Plugin<PluginOptions>, ServerRegisterOptions]
  | [[Plugin<PluginOptions>, PluginOptions], ServerRegisterOptions];

const serverPlugins: PluginRegistration[] = [
  inert,
  vision,
  loggerPlugin,
  databasePlugin,
  [apiPlugin, { routes: { prefix: '/api' } }],
  commonPlugin
];

export async function registerPlugins(server: Server): Promise<void> {
  await Promise.all(
    serverPlugins.map(async params => {
      const [pluginObject, registerOptions] = Array.isArray(params)
        ? Array.isArray(params[0])
          ? [{ plugin: params[0][0], options: params[0][1] }, params[1]]
          : [{ plugin: params[0], options: {} }, params[1]]
        : [{ plugin: params, options: {} }, {}];
      await server.register(pluginObject, registerOptions);
    })
  );
}
