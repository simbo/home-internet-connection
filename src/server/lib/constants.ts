import { existsSync } from 'fs';
import { dirname, join } from 'path';

export const ABS_SERVER_PATH = dirname(__dirname); // => /project/(src|dist|app)/server
export const ABS_APP_PATH = dirname(ABS_SERVER_PATH); // => /project/(src|dist|app)
export const ABS_ROOT_PATH = dirname(ABS_APP_PATH); // => /project
export const DIST_PATH = existsSync(join(ABS_ROOT_PATH, 'app')) ? 'app' : 'dist';
export const ABS_CLIENT_PATH = join(ABS_ROOT_PATH, DIST_PATH, 'client'); // => /project/(dist|app)/client
export const ABS_SRC_PATH = join(dirname(ABS_APP_PATH), 'src'); // => /project/src
export const ABS_VIEWS_PATH = join(ABS_SRC_PATH, 'server', 'views'); // => /project/src/server/views
export const ABS_ASSETS_PATH = join(ABS_SRC_PATH, 'client', 'assets'); // => /project/src/client/assets
