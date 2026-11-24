export interface GetAdminAuditLogsRequestDto {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export type GetAdminAuditLogsInputDto = GetAdminAuditLogsRequestDto;
