import { ServerViewsConfiguration } from '@hapi/vision';
import * as findUp from 'find-up';
import * as loadJsonFile from 'load-json-file';
import { join } from 'path';
import { compile } from 'pug';

import { ABS_ROOT_PATH } from '../../lib/constants';
import { env } from '../../lib/env';

export async function getViewManagerConfig(): Promise<ServerViewsConfiguration> {
  const pkgPath = (await findUp('package.json')) as string;
  const { name, shortName, longName, version } = (await loadJsonFile(pkgPath)) as { [key: string]: any };
  return {
    engines: {
      pug: { compile }
    },
    compileMode: 'sync',
    compileOptions: {
      pretty: false
    },
    context: {
      app: {
        name,
        shortName,
        longName,
        version
      }
    },
    isCached: env.isProduction,
    runtimeOptions: {},
    relativeTo: join(ABS_ROOT_PATH, 'src', 'server', 'views'),
    path: join(ABS_ROOT_PATH, 'src', 'server', 'views')
  };
}
