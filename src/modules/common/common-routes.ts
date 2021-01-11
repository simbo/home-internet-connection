import { ServerRoute } from '@hapi/hapi';
import { join } from 'path';

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
    path: '/',
    handler: (request, h) => {
      return h.view('index', {});
    }
  }
];
