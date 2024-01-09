import { build } from 'esbuild';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = await yargs(hideBin(process.argv))
  .option('noBundle', { type: 'boolean', default: false })
  .option('noMinify', { type: 'boolean', default: false })
  .parseAsync();

await build({
  entryPoints: ['packages/mainland/src/index.ts'],
  bundle: !args.noBundle,
  outfile: './dist/mainland.js',
  minify: !args.noMinify,
  platform: 'node',
  target: 'es2016',
  packages: 'external',
  tsconfig: 'tsconfig.build.json',
});
