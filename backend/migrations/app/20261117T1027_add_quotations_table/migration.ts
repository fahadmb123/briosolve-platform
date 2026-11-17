#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/035c8661cbb4c1c22e6722d72a853c4d7a24818db743cd2765ac658ebcb0226e/contract';
import endContract from '../../snapshots/035c8661cbb4c1c22e6722d72a853c4d7a24818db743cd2765ac658ebcb0226e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c0f046817e93fe4f32bfe8f1fbd646b066498df7b669166b07002dcfda3a928e/contract';
import startContract from '../../snapshots/c0f046817e93fe4f32bfe8f1fbd646b066498df7b669166b07002dcfda3a928e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'quotations',
        columns: [
          col('amount', 'numeric(12,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
          }),
          col('available_date_time', 'character varying(80)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 80 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('estimated_duration', 'character varying(60)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 60 } },
          }),
          col('excluded_items', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('extra_charge_policy', 'character varying(300)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 300 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('included_items', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('message_to_customer', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('quotation_type', 'text', {
            notNull: true,
            default: lit('FIXED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('service_request_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('valid_until', 'text', {
            notNull: true,
            default: lit('HOURS_24'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('valid_until_date', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('work_description', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'quotations_quotation_type_check_4adf5ec5',
            "\"quotation_type\" IN ('FIXED', 'ESTIMATED', 'INSPECTION_REQUIRED')",
          ),
          checkExpression(
            'quotations_status_check_9282885c',
            "\"status\" IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN')",
          ),
          checkExpression(
            'quotations_valid_until_check_23f86f6a',
            "\"valid_until\" IN ('HOURS_24', 'HOURS_48', 'DAYS_3', 'DAYS_7')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quotations',
        index: 'quotations_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quotations',
        index: 'quotations_service_request_id_idx_8060a003',
        columns: ['service_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quotations',
        index: 'quotations_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quotations',
        foreignKey: {
          name: 'quotations_service_request_id_fkey',
          columns: ['service_request_id'],
          references: { schema: 'public', table: 'service_requests', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quotations',
        foreignKey: {
          name: 'quotations_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
