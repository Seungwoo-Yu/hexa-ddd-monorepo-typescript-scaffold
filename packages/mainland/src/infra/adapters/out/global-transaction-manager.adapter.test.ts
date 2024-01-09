import { TestDockerInfo, useTestDocker } from '@hexa/common/test-utils';
import { initMikro, initTypeORM } from '@hexa/mainland/test-utils';
import { DataSource } from 'typeorm';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserModel as MikroUserModel } from '@hexa/mainland/infra/models/mikro/user.model';
import { UserModel as TypeORMUserModel } from '@hexa/mainland/infra/models/typeorm/user.model';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';
import {
  GlobalTransactionManagerAdapter,
  InvalidTransactionStatus,
} from '@hexa/mainland/infra/adapters/out/global-transaction-manager.adapter';

const store: { testDockerInfo: TestDockerInfo, typeorm: DataSource, mikro: MikroORM<PostgreSqlDriver> } =
  {} as { testDockerInfo: TestDockerInfo, typeorm: DataSource, mikro: MikroORM<PostgreSqlDriver> };

describe('global transaction manager test', () => {
  useTestDocker(store);

  beforeAll(async () => {
    store.typeorm = await initTypeORM(store.testDockerInfo);
    store.mikro = await initMikro(store.testDockerInfo);
  });

  afterAll(async () => {
    await store.typeorm.destroy();
    await store.mikro.close(true);
  });

  it('should not propagate changes across different connections until commit is called', async () => {
    const mikroEM = store.mikro.em.fork();
    const typeormQR = store.typeorm.createQueryRunner();
    const typeormEM = store.typeorm.createEntityManager(typeormQR);
    const queryRepo = typeormEM.getRepository(TypeORMUserModel);
    const transactionManager = new GlobalTransactionManagerAdapter(typeormQR, mikroEM);
    const uid = UlidUid.create();

    await transactionManager.start();

    const user = mikroEM.create(MikroUserModel, {
      uid: uid.uid,
      id: 'id',
      password: 'password',
      nickname: 'name',
      balance: 0,
    });
    await mikroEM.persistAndFlush(user);

    // Changes are not propagated yet
    const count1 = await queryRepo.count({ where: { uid: uid.uid } });
    expect(count1).toBeDefined();
    expect(count1).toStrictEqual(0);

    await transactionManager.commit();

    // Changes are propagated
    const count2 = await queryRepo.count({ where: { uid: uid.uid } });
    expect(count2).toBeDefined();
    expect(count2).toStrictEqual(1);
  });

  it('should not propagate changes because they are rolled back', async () => {
    const mikroEM = store.mikro.em.fork();
    const typeormQR = store.typeorm.createQueryRunner();
    const typeormEM = store.typeorm.createEntityManager(typeormQR);
    const queryRepo = typeormEM.getRepository(TypeORMUserModel);
    const transactionManager = new GlobalTransactionManagerAdapter(typeormQR, mikroEM);
    const uid = UlidUid.create();

    const oldUser1 = mikroEM.create(MikroUserModel, {
      uid: uid.uid,
      id: 'id2',
      password: 'oldPassword',
      nickname: 'oldName',
      balance: 0,
    });
    await mikroEM.persistAndFlush(oldUser1);

    await transactionManager.start();

    const oldUser2 = (await queryRepo.findOne({ where: { uid: uid.uid } }))!;
    expect(oldUser2).toBeDefined();
    expect(oldUser2.nickname).toStrictEqual(oldUser1.nickname);
    expect(oldUser2.password).toStrictEqual(oldUser1.password);

    await mikroEM.nativeUpdate(
      MikroUserModel,
      { uid: uid.uid },
      { password: 'newPassword', nickname: 'newNickname' },
    );

    await transactionManager.rollback();

    const newUser = (await queryRepo.findOne({ where: { uid: uid.uid } }))!;
    expect(newUser).toBeDefined();
    expect(newUser.nickname).toStrictEqual(oldUser2.nickname);
    expect(newUser.password).toStrictEqual(oldUser2.password);
  });

  it('should not start another transaction at the same time', async () => {
    const mikroEM = store.mikro.em.fork();
    const typeormQR = store.typeorm.createQueryRunner();
    const transactionManager = new GlobalTransactionManagerAdapter(typeormQR, mikroEM);

    await transactionManager.start();
    await expect(async () => await transactionManager.start())
      .rejects.toThrow(new InvalidTransactionStatus('already_in_transaction'));
  });

  it('should not commit if transaction is not active', async () => {
    const mikroEM = store.mikro.em.fork();
    const typeormQR = store.typeorm.createQueryRunner();
    const transactionManager = new GlobalTransactionManagerAdapter(typeormQR, mikroEM);

    await expect(async () => await transactionManager.commit())
      .rejects.toThrow(new InvalidTransactionStatus('not_in_transaction'));
  });

  it('should not rollback if transaction is not active', async () => {
    const mikroEM = store.mikro.em.fork();
    const typeormQR = store.typeorm.createQueryRunner();
    const transactionManager = new GlobalTransactionManagerAdapter(typeormQR, mikroEM);

    await expect(async () => await transactionManager.rollback())
      .rejects.toThrow(new InvalidTransactionStatus('not_in_transaction'));
  });
});
