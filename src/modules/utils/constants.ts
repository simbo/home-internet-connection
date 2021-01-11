import { dirname } from 'path';

export const ABS_BASE_PATH = dirname(dirname(__dirname)); // => /project/src | /project/dist
export const ABS_ROOT_PATH = dirname(ABS_BASE_PATH); // => /project
