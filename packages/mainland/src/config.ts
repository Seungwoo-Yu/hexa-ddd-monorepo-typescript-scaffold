import yargs from 'yargs';

export const config = yargs.env('SERVER_')
  .options({
    writerDbHost: { type: 'string', demandOption: true },
    writerDbPort: { type: 'number', demandOption: true },
    writerDbSchema: { type: 'string', demandOption: true },
    writerDbName: { type: 'string', demandOption: true },
    writerDbUser: { type: 'string', demandOption: true },
    writerDbPassword: { type: 'string', demandOption: true },
  })
  .options({
    readerDbHost: { type: 'string', demandOption: true },
    readerDbPort: { type: 'number', demandOption: true },
    readerDbSchema: { type: 'string', demandOption: true },
    readerDbName: { type: 'string', demandOption: true },
    readerDbUser: { type: 'string', demandOption: true },
    readerDbPassword: { type: 'string', demandOption: true },
  })
  .options({
    hostPort: { type: 'number', demandOption: true },
    devMode: {
      type: 'boolean',
      demandOption: true,
      default: String(process?.env?.NODE_ENV + '').replace(' ', '').toLowerCase().indexOf('dev') > -1,
    },
  })
  .parseSync();
export type Config = typeof config;
