/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'hic_server',
      script: 'dist/server/index.js',
      interpreter: 'node@14.15.4'
      // },
      // {
      //   name: 'hic_crontask_status',
      //   script: 'dist/server/cron-tasks/log-status.task.js',
      //   cron_restart: '* * * * *',
      //   autorestart: false
      // },
      // {
      //   name: 'hic_crontask_speed',
      //   script: 'dist/server/cron-tasks/log-speed.task.js',
      //   cron_restart: '*/15 * * * *',
      //   autorestart: false
    }
  ]
};
