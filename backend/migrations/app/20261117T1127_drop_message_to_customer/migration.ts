#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/035c8661cbb4c1c22e6722d72a853c4d7a24818db743cd2765ac658ebcb0226e/contract';
import startContract from '../../snapshots/035c8661cbb4c1c22e6722d72a853c4d7a24818db743cd2765ac658ebcb0226e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ddae0ee318d7ab3d9984804018f0a5412daea8351d80f76df5589c2e0399b095/contract';
import endContract from '../../snapshots/ddae0ee318d7ab3d9984804018f0a5412daea8351d80f76df5589c2e0399b095/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'quotations', column: 'message_to_customer' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
