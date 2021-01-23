import { ServerRoute } from '@hapi/hapi';

import { ABS_ASSETS_PATH, ABS_CLIENT_PATH } from '../../lib/constants';
import { Speed } from '../database/speed/speed.schema';
import { Status } from '../database/status/status.schema';

export const commonRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/client/assets/{param*}',
    handler: { directory: { path: ABS_ASSETS_PATH } }
  },
  {
    method: 'GET',
    path: '/client/{param*}',
    handler: { directory: { path: ABS_CLIENT_PATH } }
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
