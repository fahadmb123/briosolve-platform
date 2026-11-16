#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/a18563f1c1138c88baa26cc8b1b44e4537cd7ee7a3f4f59487712849c516bfd3/contract';
import startContract from '../../snapshots/a18563f1c1138c88baa26cc8b1b44e4537cd7ee7a3f4f59487712849c516bfd3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f4bcd9a43b6f6a40d2d7d6065debfc0d2fe55d5f8b14044a913c6a1ddc7b3271/contract';
import endContract from '../../snapshots/f4bcd9a43b6f6a40d2d7d6065debfc0d2fe55d5f8b14044a913c6a1ddc7b3271/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'service_requests',
        constraint: 'service_requests_budget_type_check_0f89b5ef',
      }),
      this.dropColumn({ schema: 'public', table: 'service_requests', column: 'budget_amount' }),
      this.dropColumn({ schema: 'public', table: 'service_requests', column: 'budget_type' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
