import { useState, useEffect, useMemo, useCallback } from 'react';
import { AdminPageHeader } from '../../../admin/components/AdminPageHeader';
import { AdminTable, type TableColumn } from '../../../admin/components/AdminTable';
import { AdminPagination } from '../../../admin/components/AdminPagination';
import { ReactivationReviewModal } from '../../components/ReactivationReviewModal';
import { useGetReactivations } from '../../hooks/useReactivations';
import { useUpdateStatus } from '../../../admin/customers/hooks/mutations/user.model';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal/ConfirmModal';
import { BlockReasonModal } from '../../../admin/components/BlockReasonModal';
import type { ReactivationRequestItem } from '../../types/reactivation.types';
import { toast } from 'react-toastify';

export default function Reactivations() {
  const [requests, setRequests] = useState<ReactivationRequestItem[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<ReactivationRequestItem | null>(null);
  const [requestToActivate, setRequestToActivate] = useState<ReactivationRequestItem | null>(null);
  const [requestToReject, setRequestToReject] = useState<ReactivationRequestItem | null>(null);
  const [pendingRejectConfirmation, setPendingRejectConfirmation] = useState<{ id: string; name: string; reason: string } | null>(null);

  const getReactivations = useGetReactivations();
  const updateStatus = useUpdateStatus();

  const fetchRequests = useCallback(() => {
    getReactivations.mutate(
      {
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        sort: sortOrder,
      },
      {
        onSuccess: (res) => {
          if (res?.data) {
            setRequests(res.data.requests || []);
            setTotalPages(res.data.totalPages || 1);
          }
        },
      }
    );
  }, [page, search, roleFilter, sortOrder]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = useCallback((request: ReactivationRequestItem) => {
    setRequestToActivate(request);
  }, []);

  const confirmActivate = useCallback(() => {
    if (!requestToActivate) return;
    updateStatus.mutate(
      {
        id: requestToActivate.user_id || requestToActivate.user?.id,
        status: 'ACTIVE',
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || 'Account activated successfully.');
          setRequestToActivate(null);
          setSelectedRequest(null);
          fetchRequests();
        },
      }
    );
  }, [requestToActivate, updateStatus, fetchRequests]);

  const handleReject = useCallback((request: ReactivationRequestItem) => {
    setRequestToReject(request);
  }, []);

  const handleProceedToRejectConfirm = useCallback((reason: string) => {
    if (!requestToReject) return;
    setPendingRejectConfirmation({
      id: requestToReject.user_id || requestToReject.user?.id,
      name: requestToReject.user?.name || 'User',
      reason,
    });
    setRequestToReject(null);
  }, [requestToReject]);

  const confirmReject = useCallback(() => {
    if (!pendingRejectConfirmation) return;
    updateStatus.mutate(
      {
        id: pendingRejectConfirmation.id,
        status: 'BLOCKED',
        reason: pendingRejectConfirmation.reason,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || 'Account appeal rejected successfully.');
          setPendingRejectConfirmation(null);
          setSelectedRequest(null);
          fetchRequests();
        },
      }
    );
  }, [pendingRejectConfirmation, updateStatus, fetchRequests]);

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setRoleFilter('ALL');
    setSortOrder('desc');
    setPage(1);
  }, []);

  // Table Columns
  const columns: TableColumn<ReactivationRequestItem>[] = useMemo(
    () => [
      {
        key: 'user',
        header: 'Account / User',
        render: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-border shrink-0">
              {item.user?.profile_image ? (
                <img
                  src={item.user.profile_image}
                  alt={item.user?.name || 'User'}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                item.user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <div className="font-semibold text-sm text-text">{item.user?.name || 'Unnamed User'}</div>
              <div className="text-xs text-secondary">{item.user?.email || 'No email'}</div>
              <span
                className={`inline-block mt-0.5 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${
                  item.user?.role === 'PROVIDER'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-secondary/10 text-secondary border-secondary/20'
                }`}
              >
                {item.user?.role || 'USER'}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'block_reason',
        header: 'Original Suspension Reason',
        render: (item) => (
          <div className="max-w-xs">
            <div className="text-xs text-danger font-medium line-clamp-2">
              <i className="fas fa-ban mr-1"></i>
              {item.block?.reason || 'Policy restriction'}
            </div>
            {item.block?.blocked_at && (
              <span className="text-[11px] text-muted block mt-0.5">
                {new Date(item.block.blocked_at).toLocaleDateString()}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'appeal_reason',
        header: 'Reactivation Appeal',
        render: (item) => (
          <div className="max-w-sm">
            <p className="text-xs text-text line-clamp-2 mb-0">{item.reason}</p>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (item) => (
          <span
            className={`badge px-2.5 py-1 rounded text-xs font-semibold ${
              item.status === 'APPROVED'
                ? 'badge-success bg-success/15 text-success border border-success/20'
                : item.status === 'REJECTED'
                ? 'badge-danger bg-danger/15 text-danger border border-danger/20'
                : 'badge-warning bg-warning/15 text-warning border border-warning/20'
            }`}
          >
            {item.status}
          </span>
        ),
      },
      {
        key: 'created_at',
        header: 'Submitted',
        render: (item) => (
          <span className="text-xs text-secondary">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (item) => (
          <button
            type="button"
            className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5"
            onClick={() => setSelectedRequest(item)}
          >
            <i className="fas fa-eye"></i>
            <span>Review</span>
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      {updateStatus.isPending && <SpinnerOverlay isLoading={true} />}

      <div className="app-content p-6">
        {/* Page Header */}
        <AdminPageHeader
          title="Reactivation Requests"
          description="Evaluate and adjudicate formal appeals submitted by suspended customers and providers seeking marketplace reinstatement."
        />

        {/* Filter Bar matching the other admin pages */}
        <div className="admin-filter-bar">
          {/* Left: Search input */}
          <div className="admin-search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by user, email, or appeal keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Right: Role filter, Sort by Newer/Older, and Reset */}
          <div className="admin-filters-group">
            {/* Role Filter */}
            <select
              className="admin-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="PROVIDER">Providers</option>
            </select>

            {/* Sort: Newer / Older */}
            <select
              className="admin-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as 'desc' | 'asc');
                setPage(1);
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            {(search || roleFilter !== 'ALL' || sortOrder !== 'desc') && (
              <button
                type="button"
                className="btn btn-secondary text-xs py-2"
                onClick={handleResetFilters}
              >
                <i className="fas fa-undo mr-1"></i>Reset
              </button>
            )}
          </div>
        </div>

        {/* Main Table */}
        <AdminTable
          columns={columns}
          data={requests}
          isLoading={getReactivations.isPending}
          emptyMessage="No account reactivation requests match your search or filter criteria."
          keyExtractor={(item) => item.id}
        />

        {/* Pagination */}
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />

        {/* Review Modal */}
        <ReactivationReviewModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          isLoading={updateStatus.isPending}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Activation Confirmation Modal */}
        <ConfirmModal
          isOpen={!!requestToActivate}
          title="Confirm Account Activation"
          message={`Are you sure you want to approve this appeal and activate ${requestToActivate?.user?.name || 'this user'}'s account?`}
          confirmText="Activate"
          cancelText="Cancel"
          isDanger={false}
          isLoading={updateStatus.isPending}
          onConfirm={confirmActivate}
          onCancel={() => setRequestToActivate(null)}
        />

        {/* Rejection Reason Modal */}
        <BlockReasonModal
          isOpen={!!requestToReject}
          userName={requestToReject?.user?.name || 'User'}
          userId={requestToReject?.user_id || requestToReject?.user?.id || ''}
          isLoading={updateStatus.isPending}
          onConfirm={handleProceedToRejectConfirm}
          onClose={() => setRequestToReject(null)}
        />

        {/* Rejection Final Confirmation Modal */}
        <ConfirmModal
          isOpen={!!pendingRejectConfirmation}
          title="Confirm Appeal Rejection"
          message={`Are you sure you want to reject the appeal for ${pendingRejectConfirmation?.name}? Reason: "${pendingRejectConfirmation?.reason}"`}
          confirmText="Confirm Rejection"
          cancelText="Cancel"
          isDanger={true}
          isLoading={updateStatus.isPending}
          onConfirm={confirmReject}
          onCancel={() => setPendingRejectConfirmation(null)}
        />
      </div>
    </>
  );
}
