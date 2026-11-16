#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/c0f046817e93fe4f32bfe8f1fbd646b066498df7b669166b07002dcfda3a928e/contract';
import endContract from '../../snapshots/c0f046817e93fe4f32bfe8f1fbd646b066498df7b669166b07002dcfda3a928e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f4bcd9a43b6f6a40d2d7d6065debfc0d2fe55d5f8b14044a913c6a1ddc7b3271/contract';
import startContract from '../../snapshots/f4bcd9a43b6f6a40d2d7d6065debfc0d2fe55d5f8b14044a913c6a1ddc7b3271/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'service_requests',
        column: col('answers', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'services',
        column: col('questions', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
