import { ServerRoute } from '@hapi/hapi';
import { join } from 'path';

import { Speed } from '../database/speed/speed.schema';
import { Status } from '../database/status/status.schema';
import { ABS_ROOT_PATH } from '../utils/constants';

export const commonRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/client/{param*}',
    handler: {
      directory: {
        path: join(ABS_ROOT_PATH, 'dist', 'client')
      }
    }
  },
  {
    method: 'GET',
    path: '/styles/{param*}',
    handler: {
      directory: {
        path: join(ABS_ROOT_PATH, 'dist', 'styles')
      }
    }
  },
  {
    method: 'GET',
    path: '/log-speed',
    handler: async (request, h) => {
      const entry = await Speed.logSpeed();
      return entry.toResponse();
    }
  },
  {
    method: 'GET',
    path: '/log-status',
    handler: async (request, h) => {
      const entry = await Status.logStatus();
      return entry.toResponse();
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('index', {});
    }
  }
];
