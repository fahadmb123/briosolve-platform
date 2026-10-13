export type ReactivationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReactivationUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER';
  profile_image?: string | null;
  status: string;
}

export interface ReactivationBlock {
  id: string;
  reason: string;
  blocked_at: string;
  blocked_by?: string;
}

export interface ReactivationRequestItem {
  id: string;
  user_id: string;
  block_id: string;
  reason: string;
  status: ReactivationStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
  user: ReactivationUser;
  block?: ReactivationBlock;
}
