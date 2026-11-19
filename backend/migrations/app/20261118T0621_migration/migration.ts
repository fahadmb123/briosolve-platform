#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/ddae0ee318d7ab3d9984804018f0a5412daea8351d80f76df5589c2e0399b095/contract';
import startContract from '../../snapshots/ddae0ee318d7ab3d9984804018f0a5412daea8351d80f76df5589c2e0399b095/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e984a5dff6d3ef63a8920b4aa70d8be5e7a9cd67c9d0ea19dcd4295db0528a17/contract';
import endContract from '../../snapshots/e984a5dff6d3ef63a8920b4aa70d8be5e7a9cd67c9d0ea19dcd4295db0528a17/contract.json' with { type: 'json' };
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
        table: 'bookings',
        columns: [
          col('booking_number', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('customer_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('notes', 'character varying(1000)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('order_id', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('payment_id', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('platform_fee', 'numeric(12,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
          }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('quotation_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('scheduled_date', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('scheduled_time', 'character varying(80)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 80 } },
          }),
          col('service_request_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('CONFIRMED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('total_amount', 'numeric(12,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'bookings_status_check_9a77072c',
            "\"status\" IN ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'bookings',
        constraint: 'bookings_booking_number_key',
        columns: ['booking_number'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'bookings',
        constraint: 'bookings_quotation_id_key',
        columns: ['quotation_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookings',
        index: 'bookings_customer_id_idx_e16dfa6b',
        columns: ['customer_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookings',
        index: 'bookings_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookings',
        index: 'bookings_quotation_id_idx_617d3967',
        columns: ['quotation_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookings',
        index: 'bookings_service_request_id_idx_8060a003',
        columns: ['service_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookings',
        index: 'bookings_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookings',
        foreignKey: {
          name: 'bookings_service_request_id_fkey',
          columns: ['service_request_id'],
          references: { schema: 'public', table: 'service_requests', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookings',
        foreignKey: {
          name: 'bookings_quotation_id_fkey',
          columns: ['quotation_id'],
          references: { schema: 'public', table: 'quotations', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookings',
        foreignKey: {
          name: 'bookings_customer_id_fkey',
          columns: ['customer_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookings',
        foreignKey: {
          name: 'bookings_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
