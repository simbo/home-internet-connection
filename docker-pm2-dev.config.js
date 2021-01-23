/* eslint-disable */
const options = {
  out_file: '/dev/null',
  error_file: '/dev/null',
  log_date_format: 'HH:mm:ss'
};

const watchOptions = {
  watch_delay: 1000,
  ignore_watch: ['node_modules'],
  watch_options: {
    followSymlinks: false
  },
  autorestart: false
};

module.exports = {
  apps: [
    {
      name: 'server',
      script: 'ts-node --log-error --project tsconfig.json src/server/index.ts',
      watch: ['src/server/**/*', 'package.json', 'tsconfig.json', '.env'],
      ...options,
      ...watchOptions
    },
    // {
    //   name: 'cron:status',
    //   script: 'ts-node --log-error --project tsconfig.json src/server/cron-tasks/log-status.task.ts',
    //   cron_restart: '* * * * *',
    //   watch: ['src/server/**/*', 'package.json', 'tsconfig.json', '.env'],
    //   ...options,
    //   ...watchOptions
    // },
    // {
    //   name: 'cron:speed',
    //   script: 'ts-node --log-error --project tsconfig.json src/server/cron-tasks/log-speed.task.ts',
    //   cron_restart: '*/15 * * * *',
    //   watch: ['src/server/**/*', 'package.json', 'tsconfig.json', '.env'],
    //   ...options,
    //   ...watchOptions
    // },
    {
      name: 'client',
      script: 'yarn run dev:client',
      ...options
    },
    {
      name: 'styles',
      script: 'yarn run dev:styles',
      ...options
    }
  ]
};
