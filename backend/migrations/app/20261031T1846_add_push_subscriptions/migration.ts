#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1d17f557e4e3e391fe5a7594fd9dd954a0926df3d668d46e9ceb6cc8e77d14bf/contract';
import endContract from '../../snapshots/1d17f557e4e3e391fe5a7594fd9dd954a0926df3d668d46e9ceb6cc8e77d14bf/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/6247420855ac4a380fb2fdedff6c1e69ad8dcefca90bc1132d5b4160e5f073d3/contract';
import startContract from '../../snapshots/6247420855ac4a380fb2fdedff6c1e69ad8dcefca90bc1132d5b4160e5f073d3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'push_subscriptions',
        columns: [
          col('auth', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('endpoint', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('p256dh', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'push_subscriptions',
        constraint: 'push_subscriptions_endpoint_key',
        columns: ['endpoint'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'push_subscriptions',
        index: 'push_subscriptions_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'push_subscriptions',
        foreignKey: {
          name: 'push_subscriptions_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
