export interface AdminAuditLogEntry {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  actor?: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  metadata?: Record<string, any>;
}

export interface AdminAuditLogsResponseDto {
  logs: AdminAuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
