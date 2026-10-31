#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6247420855ac4a380fb2fdedff6c1e69ad8dcefca90bc1132d5b4160e5f073d3/contract';
import endContract from '../../snapshots/6247420855ac4a380fb2fdedff6c1e69ad8dcefca90bc1132d5b4160e5f073d3/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'account_reactivation_requests',
        columns: [
          col('block_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('reason', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('reviewed_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('reviewed_by', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'account_reactivation_requests_status_check_56005a61',
            "\"status\" IN ('PENDING', 'APPROVED', 'REJECTED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'addresses',
        columns: [
          col('area', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('city', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('country', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('district', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('house_no', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('landmark', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('latitude', 'numeric(10,7)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 7 } },
          }),
          col('longitude', 'numeric(10,7)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 7 } },
          }),
          col('pincode', 'character varying(20)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('state', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('type', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'categories',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
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
            'categories_status_check_ee520df2',
            "\"status\" IN ('ACTIVE', 'INACTIVE')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'customer_profiles',
        columns: [
          col('about', 'character varying(500)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('profile_image', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('service_radius_km', 'int4', {
            default: lit(20),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'notifications',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('data', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('is_read', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('message', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('read_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('recipient_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('title', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('title_code', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('type', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'provider_availability',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('day_of_week', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('end_time', 'character varying(5)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 5 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('start_time', 'character varying(5)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 5 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'provider_availability_day_of_week_check_a42e429c',
            "\"day_of_week\" IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'provider_availability_overrides',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('end_time', 'character varying(5)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 5 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('override_date', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('reason', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('start_time', 'character varying(5)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 5 } },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'provider_availability_overrides_type_check_b3c23fd3',
            "\"type\" IN ('DAY_OFF', 'CUSTOM_HOURS')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'provider_profiles',
        columns: [
          col('accepting_leads', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('bio', 'character varying(2000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 2000 } },
          }),
          col('business_name', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('completed_jobs', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('experience', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('kyc_status', 'text', {
            notNull: true,
            default: lit('NOT_SUBMITTED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('profile_image', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('service_radius_km', 'int4', {
            default: lit(20),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('skills', 'character varying(1000)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('travel_buffer_minutes', 'int4', {
            notNull: true,
            default: lit(30),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'provider_profiles_kyc_status_check_624ac8d0',
            "\"kyc_status\" IN ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'provider_services',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('service_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'provider_verification_documents',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('document_name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('document_type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('provider_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('rejection_reason', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
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
            'provider_verification_documents_document_type_check_c7e0d7aa',
            "\"document_type\" IN ('IDENTITY', 'CERTIFICATE')",
          ),
          checkExpression(
            'provider_verification_documents_status_check_56005a61',
            "\"status\" IN ('PENDING', 'APPROVED', 'REJECTED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'provider_verification_files',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('document_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('file_url', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'services',
        columns: [
          col('category_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'character varying(1000)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('services_status_check_ee520df2', "\"status\" IN ('ACTIVE', 'INACTIVE')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'user_account_blocks',
        columns: [
          col('blocked_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('blocked_by', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('reason', 'character varying(1000)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('unblocked_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('current_address_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('email_verified', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('password_hash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('phone', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('phone_verified', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
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
            'users_role_check_81c698e4',
            "\"role\" IN ('CUSTOMER', 'PROVIDER', 'ADMIN')",
          ),
          checkExpression(
            'users_status_check_6939929a',
            "\"status\" IN ('ACTIVE', 'INACTIVE', 'BLOCKED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'categories',
        constraint: 'categories_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'customer_profiles',
        constraint: 'customer_profiles_user_id_key',
        columns: ['user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'provider_profiles',
        constraint: 'provider_profiles_user_id_key',
        columns: ['user_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'provider_services',
        constraint: 'provider_services_provider_id_service_id_key',
        columns: ['provider_id', 'service_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'account_reactivation_requests',
        index: 'account_reactivation_requests_block_id_idx_93edd389',
        columns: ['block_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'account_reactivation_requests',
        index: 'account_reactivation_requests_reviewed_by_idx_ef840284',
        columns: ['reviewed_by'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'account_reactivation_requests',
        index: 'account_reactivation_requests_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'addresses',
        index: 'addresses_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notifications',
        index: 'notifications_recipient_id_idx_1e4ca6fd',
        columns: ['recipient_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notifications',
        index: 'notifications_recipient_id_is_read_created_at_idx_681b2a09',
        columns: ['recipient_id', 'is_read', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'provider_availability',
        index: 'provider_availability_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'provider_availability_overrides',
        index: 'provider_availability_overrides_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'provider_services',
        index: 'provider_services_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'provider_services',
        index: 'provider_services_service_id_idx_cd05e196',
        columns: ['service_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'provider_verification_documents',
        index: 'provider_verification_documents_provider_id_idx_d89e110d',
        columns: ['provider_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'provider_verification_files',
        index: 'provider_verification_files_document_id_idx_d3d0944e',
        columns: ['document_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'services',
        index: 'services_category_id_idx_da7213d4',
        columns: ['category_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user_account_blocks',
        index: 'user_account_blocks_blocked_by_idx_652f5112',
        columns: ['blocked_by'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user_account_blocks',
        index: 'user_account_blocks_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'users',
        index: 'users_current_address_id_idx_451a5e86',
        columns: ['current_address_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'account_reactivation_requests',
        foreignKey: {
          name: 'account_reactivation_requests_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'account_reactivation_requests',
        foreignKey: {
          name: 'account_reactivation_requests_block_id_fkey',
          columns: ['block_id'],
          references: { schema: 'public', table: 'user_account_blocks', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'account_reactivation_requests',
        foreignKey: {
          name: 'account_reactivation_requests_reviewed_by_fkey',
          columns: ['reviewed_by'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'addresses',
        foreignKey: {
          name: 'addresses_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'customer_profiles',
        foreignKey: {
          name: 'customer_profiles_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notifications',
        foreignKey: {
          name: 'notifications_recipient_id_fkey',
          columns: ['recipient_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_availability',
        foreignKey: {
          name: 'provider_availability_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_availability_overrides',
        foreignKey: {
          name: 'provider_availability_overrides_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_profiles',
        foreignKey: {
          name: 'provider_profiles_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_services',
        foreignKey: {
          name: 'provider_services_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_services',
        foreignKey: {
          name: 'provider_services_service_id_fkey',
          columns: ['service_id'],
          references: { schema: 'public', table: 'services', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_verification_documents',
        foreignKey: {
          name: 'provider_verification_documents_provider_id_fkey',
          columns: ['provider_id'],
          references: { schema: 'public', table: 'provider_profiles', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'provider_verification_files',
        foreignKey: {
          name: 'provider_verification_files_document_id_fkey',
          columns: ['document_id'],
          references: {
            schema: 'public',
            table: 'provider_verification_documents',
            columns: ['id'],
          },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'services',
        foreignKey: {
          name: 'services_category_id_fkey',
          columns: ['category_id'],
          references: { schema: 'public', table: 'categories', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user_account_blocks',
        foreignKey: {
          name: 'user_account_blocks_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user_account_blocks',
        foreignKey: {
          name: 'user_account_blocks_blocked_by_fkey',
          columns: ['blocked_by'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'users',
        foreignKey: {
          name: 'users_current_address_id_fkey',
          columns: ['current_address_id'],
          references: { schema: 'public', table: 'addresses', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
