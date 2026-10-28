import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useGetProviders, useUpdateProviderStatus as useUpdateStatus } from '../../hooks/admin/useAdminProviders';
import { toast } from 'react-hot-toast';
import type { User, response } from '../../types/profile.types';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";
import { BlockReasonModal } from "../../../admin/components/BlockReasonModal";
import ProviderRow from "../../components/admin/ProviderRow";
import Skeleton from "react-loading-skeleton";

export default function Providers() {
    const [providers, setProviders] = useState<User[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [providerToBlock, setProviderToBlock] = useState<{ id: string; name: string } | null>(null);
    const [pendingBlockConfirmation, setPendingBlockConfirmation] = useState<{ id: string; name: string; reason: string } | null>(null);
    const [providerToActivate, setProviderToActivate] = useState<{ id: string; name: string } | null>(null);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getProviders = useGetProviders();
    const updateStatus = useUpdateStatus();

    useEffect(() => {
        getProviders.mutate({ page, search, filter, limit }, {
            onSuccess: (res: response<{ users: User[]; total: number; totalPages: number }>) => {
                setProviders(res.data.users);
                setTotal(res.data.total);
                setTotalPages(res.data.totalPages);
            }
        });
    }, [filter, search, page]);

    const handleStatusButton = useCallback((id: string, status: string) => {
        const target = providers.find((u) => u.id === id);
        if (status === "ACTIVE") {
            setProviderToBlock({ id, name: target?.name || "Provider" });
        } else {
            setProviderToActivate({ id, name: target?.name || "Provider" });
        }
    }, [providers]);

    const handleProceedToBlockConfirm = useCallback((reason: string) => {
        if (!providerToBlock) return;
        setPendingBlockConfirmation({
            id: providerToBlock.id,
            name: providerToBlock.name,
            reason
        });
        setProviderToBlock(null);
    }, [providerToBlock]);

    const handleViewProvider = useCallback((provider: User) => {
        setSelectedProvider(provider);
    }, []);

    const handleCloseProviderModal = useCallback(() => {
        setSelectedProvider(null);
    }, []);

    const confirmBlock = useCallback(() => {
        if (!pendingBlockConfirmation) return;
        updateStatus.mutate({
            id: pendingBlockConfirmation.id,
            status: "BLOCKED",
            reason: pendingBlockConfirmation.reason
        }, {
            onSuccess: (res: response<{ users: User[] }>) => {
                setProviders((users: User[]) => 
                    users.map((user) => user.id === pendingBlockConfirmation.id ? { ...user, status: "BLOCKED" } : user)
                );
                setPendingBlockConfirmation(null);
                toast.success(res.message);
            }
        });
    }, [pendingBlockConfirmation, updateStatus]);

    const confirmActivate = useCallback(() => {
        if (!providerToActivate) return;
        updateStatus.mutate({
            id: providerToActivate.id,
            status: "ACTIVE"
        }, {
            onSuccess: (res: response<{ users: User[] }>) => {
                setProviders((users: User[]) => 
                    users.map((user) => user.id === providerToActivate.id ? { ...user, status: "ACTIVE" } : user)
                );
                setProviderToActivate(null);
                toast.success(res.message);
            }
        });
    }, [providerToActivate, updateStatus]);

    const handleReset = useCallback(() => {
        setSearch("");
        setFilter("");
        setPage(1);
    }, []);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);

    return (
        <>
            {updateStatus.isPending ? (<SpinnerOverlay isLoading={true} />) : null}

            <div className="app-content">
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>Service Provider Management</h1>
                        <p className="text-secondary text-sm mb-0">Track credentialed professionals, verification status, service capacities, and account governance.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/admin/verification" className="btn btn-warning text-xs">
                            <i className="fas fa-user-check mr-1"></i>Review Verification Queue
                        </Link>
                    </div>
                </div>

                <div className="admin-filter-bar">
                    <div className="admin-search-input">
                        <i className="fas fa-search"></i>
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            type="text"
                            placeholder="Search by email..."
                            id="providerSearchInput"
                        />
                    </div>

                    <div className="admin-filters-group">
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setPage(1);
                            }}
                            className="admin-select"
                            id="statusFilter"
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="BLOCKED">Suspended</option>
                        </select>

                        <button className="btn btn-secondary text-xs py-2" onClick={handleReset}>
                            <i className="fas fa-undo mr-1"></i>Reset
                        </button>
                    </div>
                </div>

                <div className="admin-table-card">
                    <div className="admin-table-header">
                        <div className="text-sm font-semibold text-text">{total} Providers Listed</div>
                        <div className="text-xs text-muted"><i className="fas fa-shield-alt mr-1 text-primary"></i>Admin Action Logging Active</div>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Provider &amp; Business</th>
                                    <th style={{ width: '20%' }}>Email Address</th>
                                    <th style={{ width: '15%' }}>Phone</th>
                                    <th style={{ width: '10%' }}>Jobs</th>
                                    <th style={{ width: '12%' }}>KYC Status</th>
                                    <th style={{ width: '10%' }}>Account Status</th>
                                    <th className="text-right" style={{ width: '8%' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProviders.isPending ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={`provider-skel-${i}`} className="border-b border-border">
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton circle width={36} height={36} />
                                                    <div className="flex-1">
                                                        <Skeleton width={110} height={15} />
                                                        <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td><Skeleton width="85%" height={15} /></td>
                                            <td><Skeleton width="70%" height={15} /></td>
                                            <td><Skeleton width={50} height={15} /></td>
                                            <td><Skeleton width={80} height={22} borderRadius={12} /></td>
                                            <td><Skeleton width={65} height={22} borderRadius={12} /></td>
                                            <td className="text-right">
                                                <Skeleton width={50} height={28} borderRadius={6} />
                                            </td>
                                        </tr>
                                    ))
                                ) : providers.length > 0 ? (
                                    providers.map((provider) => (
                                        <ProviderRow
                                            key={provider.id}
                                            provider={provider}
                                            onView={handleViewProvider}
                                            onToggleStatus={handleStatusButton}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-secondary">
                                            No provider accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-pagination">
                        <div>
                            Showing <strong>{` ${page} of ${totalPages || 1} pages`}</strong>
                        </div>

                        <div className="pagination-controls">
                            <button
                                className="page-btn"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            {pageNumbers.map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    className={`page-btn ${page === pageNumber ? "active" : ""}`}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            <button
                                className="page-btn"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`admin-modal-overlay ${selectedProvider ? 'active' : ''}`} id="providerDetailsModal">
                <div className="admin-modal">
                    <div className="admin-modal-header">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-id-card text-primary"></i>
                            <h3 className="h6 mb-0">Provider Dossier</h3>
                        </div>
                        <button className="btn-icon" onClick={handleCloseProviderModal}><i className="fas fa-times"></i></button>
                    </div>
                    <div className="admin-modal-body">
                        {selectedProvider && (
                            <>
                                <div className="text-center mb-6">
                                    <img
                                        src={selectedProvider.provider_profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProvider.name)}&background=6366F1&color=fff`}
                                        className="avatar avatar-lg mx-auto mb-3 border border-border rounded-full"
                                        alt="Avatar"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <h4 className="h5 mb-1 text-text">{selectedProvider.name}</h4>
                                    <p className="text-xs text-secondary mb-2">{selectedProvider.provider_profile?.business_name || 'Individual Provider'}</p>
                                    <div className="flex justify-center items-center gap-2">
                                        <span className={`badge ${selectedProvider.status === 'ACTIVE' ? 'badge-verified' : selectedProvider.status === 'BLOCKED' ? 'badge-danger-alert' : 'badge-pending'} text-xs`}>
                                            {selectedProvider.status}
                                        </span>
                                        <span className={`badge ${selectedProvider.provider_profile?.kyc_status === 'APPROVED' ? 'badge-verified' : selectedProvider.provider_profile?.kyc_status === 'PENDING' ? 'badge-pending' : 'badge-secondary'} text-xs`}>
                                            KYC: {selectedProvider.provider_profile?.kyc_status || 'NOT_SUBMITTED'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">Email Address</span>
                                        <span className="text-sm font-semibold text-text">{selectedProvider.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">Phone Number</span>
                                        <span className="text-sm font-semibold text-text">{selectedProvider.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">Experience</span>
                                        <span className="text-sm font-semibold text-text">{selectedProvider.provider_profile?.experience || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">Completed Jobs</span>
                                        <span className="text-sm font-semibold text-text">{selectedProvider.provider_profile?.completed_jobs ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">Joined Date</span>
                                        <span className="text-sm font-semibold text-text">{new Date(selectedProvider.created_at.toString()).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">Internal ID</span>
                                        <span className="text-xs font-mono text-muted">{selectedProvider.id}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="admin-modal-footer">
                        <button className="btn btn-secondary text-xs" onClick={handleCloseProviderModal}>Close</button>
                    </div>
                </div>
            </div>

            <BlockReasonModal
                isOpen={!!providerToBlock}
                userName={providerToBlock?.name || "Provider"}
                userId={providerToBlock?.id || ""}
                isLoading={updateStatus.isPending}
                onConfirm={handleProceedToBlockConfirm}
                onClose={() => setProviderToBlock(null)}
            />

            <ConfirmModal
                isOpen={!!pendingBlockConfirmation}
                title="Confirm Account Suspension"
                message={`Are you sure you want to block ${pendingBlockConfirmation?.name}? Reason: "${pendingBlockConfirmation?.reason}"`}
                confirmText="Confirm Block"
                cancelText="Cancel"
                isDanger={true}
                isLoading={updateStatus.isPending}
                onConfirm={confirmBlock}
                onCancel={() => setPendingBlockConfirmation(null)}
            />

            <ConfirmModal
                isOpen={!!providerToActivate}
                title="Activate Provider"
                message={`Are you sure you want to activate ${providerToActivate?.name}'s account?`}
                confirmText="Activate"
                cancelText="Cancel"
                isDanger={false}
                isLoading={updateStatus.isPending}
                onConfirm={confirmActivate}
                onCancel={() => setProviderToActivate(null)}
            />
        </>
    );
}
