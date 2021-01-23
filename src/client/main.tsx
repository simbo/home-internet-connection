import { render } from 'preact';

import { App } from './components/app';
import { env } from './lib/env';

console.log(env);

document.body.className = '';
render(<App />, document.body);
