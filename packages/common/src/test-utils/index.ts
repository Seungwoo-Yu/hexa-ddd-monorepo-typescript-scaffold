import {
  ChildProcess,
  ChildProcessByStdio,
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptions,
  SpawnOptionsWithoutStdio,
  SpawnOptionsWithStdioTuple,
  StdioNull,
  StdioPipe,
} from 'node:child_process';
import { Readable, Writable } from 'node:stream';
import net from 'node:net';

const linuxBased = process.platform !== 'darwin' && process.platform !== 'win32';

export type ExtraSpawnOptions = {
  useSudo: boolean,
};
function toCommandArgs(commandStr: string, options: ExtraSpawnOptions): [string, string[]] {
  const args = commandStr.split(' ');
  if (args.length === 0) {
    throw new Error('commandStr is empty');
  }

  if (options.useSudo && linuxBased) {
    return ['sudo', args];
  }

  const command = args.shift();
  if (command == null) {
    throw new Error('commandStr is empty');
  }

  return [command, args];
}

export function spawnCommand(
  command: string,
  options: SpawnOptionsWithoutStdio,
  extra?: ExtraSpawnOptions,
): ChildProcessWithoutNullStreams;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<Writable, Readable, Readable>;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<Writable, Readable, null>;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<Writable, null, Readable>;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<null, Readable, Readable>;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<Writable, null, null>;
export function spawnCommand(
  command: string,
  options:SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<null, Readable, null>;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<null, null, Readable>;
export function spawnCommand(
  command: string,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>,
  extra?: ExtraSpawnOptions,
): ChildProcessByStdio<null, null, null>;
export function spawnCommand(command: string, options: SpawnOptions, extra?: ExtraSpawnOptions): ChildProcess;
export function spawnCommand(
  command: string,
  options: SpawnOptions,
  extra: ExtraSpawnOptions = { useSudo: false },
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return spawn.bind(this, ...toCommandArgs(command, extra))(options);
}

export async function randomPort() {
  const server = net.createServer();
  await new Promise<void>(resolve => {
    server.listen(0, '0.0.0.0', () => {
      resolve();
    });
  });

  const address = server.address();
  if (address == null || typeof address !== 'object') {
    throw new Error('port couldn\'t be resolved');
  }

  await new Promise<void>(resolve => {
    server.close(() => {
      resolve();
    });
  });

  return address.port;
}

export * from './postgres-docker';
