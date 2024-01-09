import { PassThrough } from 'node:stream';
import { Buffer } from 'node:buffer';
import { randomPort, spawnCommand } from '@hexa/common/test-utils';

export class TestDockerInfo {
  constructor(
    public readonly containerName: string,
    public readonly port: number,
    public readonly userName: string,
    public readonly password: string,
    public readonly schemaName: string,
    public readonly databaseName: string,
  ) {
  }
}

async function startTestDocker() {
  const port = await randomPort();
  const name = 'hexa-test-docker-' + port;
  const info = new TestDockerInfo(
    name,
    port,
    'postgres',
    'password',
    'public',
    'postgres',
  );

  const startChild = spawnCommand(
    [
      'docker run --rm -d',
      `--name ${info.containerName}`,
      `-p ${info.port}:5432`,
      `-e POSTGRES_USER=${info.userName}`,
      `-e POSTGRES_PASSWORD=${info.password}`,
      `-e POSTGRES_DB=${info.databaseName}`,
      '--mount type=tmpfs,destination=/var/lib/postgresql/data',
      'postgres:16',
    ].join(' '),
    {
      stdio: 'inherit',
    },
    {
      useSudo: true,
    },
  );

  await new Promise<void>((resolve, reject) => {
    startChild.once('exit', code => {
      if (code == null || code === 0) {
        resolve();
        return;
      }

      reject('test docker couldn\'t turn on successfully (1)');
    });
  });

  startChild.kill();

  const logChild = spawnCommand(
    'docker logs -f --tail 50 ' + info.containerName,
    {
      stdio: [
        'ignore',
        'pipe',
        'pipe',
      ],
    },
    {
      useSudo: true,
    },
  );

  let lineCnt = 0;
  let databaseRebooted = false;
  const passThrough = new PassThrough();
  logChild.stdio[1].pipe(passThrough);
  logChild.stdio[2].pipe(passThrough);

  await new Promise<void>((resolve, reject) => {
    passThrough.on('data', (chunk: Buffer) => {
      if (chunk.toString().indexOf('database system is ready to accept connections') > -1) {
        if (!databaseRebooted) {
          databaseRebooted = true;
          return;
        }

        resolve();
      }


      if (++lineCnt >= 50) {
        reject('test docker couldn\'t turn on successfully (2)');
      }
    });
  }).finally(() => {
    logChild.stdio[1].destroy();
    logChild.stdio[2].destroy();
    passThrough.destroy();
    logChild.kill();
  });

  return info;
}

async function stopTestDocker(name: string) {
  const child = spawnCommand(
    `docker stop ${name}`,
    {
      stdio: 'inherit',
    },
    {
      useSudo: true,
    },
  );

  await new Promise<void>((resolve, reject) => {
    child.once('exit', (code: number | null) => {
      if (code == null || code === 0) {
        resolve();
        return;
      }

      reject('test docker couldn\'t turn off successfully');
    });
  });

  child.kill();
}

export function useTestDocker(
  target: { testDockerInfo: TestDockerInfo },
) {
  beforeAll(async () => {
    target.testDockerInfo = await startTestDocker();
  });

  afterAll(async () => {
    await stopTestDocker(target.testDockerInfo.containerName);
  });
}
