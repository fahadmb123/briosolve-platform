#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1d17f557e4e3e391fe5a7594fd9dd954a0926df3d668d46e9ceb6cc8e77d14bf/contract';
import startContract from '../../snapshots/1d17f557e4e3e391fe5a7594fd9dd954a0926df3d668d46e9ceb6cc8e77d14bf/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a18563f1c1138c88baa26cc8b1b44e4537cd7ee7a3f4f59487712849c516bfd3/contract';
import endContract from '../../snapshots/a18563f1c1138c88baa26cc8b1b44e4537cd7ee7a3f4f59487712849c516bfd3/contract.json' with { type: 'json' };
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
      this.dropColumn({
        schema: 'public',
        table: 'customer_profiles',
        column: 'service_radius_km',
      }),
      this.createTable({
        schema: 'public',
        table: 'conversation_participants',
        columns: [
          col('conversation_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('joined_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('last_read_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'conversations',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('type', 'text', {
            notNull: true,
            default: lit('DIRECT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'conversations_status_check_f94a3a5d',
            "\"status\" IN ('ACTIVE', 'CLOSED')",
          ),
          checkExpression('conversations_type_check_88fadaa3', "\"type\" IN ('DIRECT', 'GROUP')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'messages',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('conversation_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deleted_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('message_type', 'text', {
            notNull: true,
            default: lit('TEXT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('sender_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'messages_message_type_check_ca908fbd',
            "\"message_type\" IN ('TEXT', 'IMAGE', 'FILE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'service_request_images',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('display_order', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_key', 'character varying(500)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('service_request_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'service_request_providers',
        columns: [
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('matched_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('service_request_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('MATCHED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('viewed_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'service_request_providers_status_check_b3894f35',
            "\"status\" IN ('MATCHED', 'VIEWED', 'QUOTED', 'DECLINED', 'EXPIRED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'service_requests',
        columns: [
          col('address_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('available_time_from', 'time', {
            notNull: true,
            codecRef: { codecId: 'pg/time-temporal@1' },
          }),
          col('available_time_to', 'time', {
            notNull: true,
            codecRef: { codecId: 'pg/time-temporal@1' },
          }),
          col('budget_amount', 'numeric(10,2)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('budget_type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('category_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('customer_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('description', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('specific_date', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subservice_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('title', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('urgency', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'service_requests_budget_type_check_0f89b5ef',
            "\"budget_type\" IN ('OPEN_BID', 'FIXED')",
          ),
          checkExpression(
            'service_requests_status_check_bada4c1d',
            "\"status\" IN ('PENDING', 'ACTIVE', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED')",
          ),
          checkExpression(
            'service_requests_urgency_check_6c656154',
            "\"urgency\" IN ('TODAY', 'THIS_WEEK', 'SPECIFIC_DATE', 'FLEXIBLE')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'conversation_participants',
        constraint: 'conversation_participants_conversation_id_user_id_key',
        columns: ['conversation_id', 'user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'service_request_providers',
        constraint: 'service_request_providers_service_request_id_provider_id_key',
        columns: ['service_request_id', 'provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'conversation_participants',
        index: 'conversation_participants_conversation_id_idx_0c3639df',
        columns: ['conversation_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'conversation_participants',
        index: 'conversation_participants_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'messages',
        index: 'messages_conversation_id_idx_0c3639df',
        columns: ['conversation_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'messages',
        index: 'messages_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'messages',
        index: 'messages_sender_id_idx_311853a4',
        columns: ['sender_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_request_images',
        index: 'service_request_images_service_request_id_idx_8060a003',
        columns: ['service_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_request_providers',
        index: 'service_request_providers_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_request_providers',
        index: 'service_request_providers_service_request_id_idx_8060a003',
        columns: ['service_request_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_requests',
        index: 'service_requests_address_id_idx_f563b795',
        columns: ['address_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_requests',
        index: 'service_requests_category_id_idx_da7213d4',
        columns: ['category_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_requests',
        index: 'service_requests_customer_id_idx_e16dfa6b',
        columns: ['customer_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'service_requests',
        index: 'service_requests_subservice_id_idx_cb8729b6',
        columns: ['subservice_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'conversation_participants',
        foreignKey: {
          name: 'conversation_participants_conversation_id_fkey',
          columns: ['conversation_id'],
          references: { schema: 'public', table: 'conversations', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'conversation_participants',
        foreignKey: {
          name: 'conversation_participants_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'messages',
        foreignKey: {
          name: 'messages_conversation_id_fkey',
          columns: ['conversation_id'],
          references: { schema: 'public', table: 'conversations', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'messages',
        foreignKey: {
          name: 'messages_sender_id_fkey',
          columns: ['sender_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_request_images',
        foreignKey: {
          name: 'service_request_images_service_request_id_fkey',
          columns: ['service_request_id'],
          references: { schema: 'public', table: 'service_requests', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_request_providers',
        foreignKey: {
          name: 'service_request_providers_service_request_id_fkey',
          columns: ['service_request_id'],
          references: { schema: 'public', table: 'service_requests', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_request_providers',
        foreignKey: {
          name: 'service_request_providers_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_requests',
        foreignKey: {
          name: 'service_requests_customer_id_fkey',
          columns: ['customer_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_requests',
        foreignKey: {
          name: 'service_requests_category_id_fkey',
          columns: ['category_id'],
          references: { schema: 'public', table: 'categories', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_requests',
        foreignKey: {
          name: 'service_requests_subservice_id_fkey',
          columns: ['subservice_id'],
          references: { schema: 'public', table: 'services', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'service_requests',
        foreignKey: {
          name: 'service_requests_address_id_fkey',
          columns: ['address_id'],
          references: { schema: 'public', table: 'addresses', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
