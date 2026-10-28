import { useEffect, useState, useMemo, useCallback } from "react";
import { useGetCustomers, useUpdateCustomerStatus as useUpdateStatus } from '../../hooks/admin/useAdminCustomers';
import { toast } from 'react-hot-toast';
import type { User, response } from '../../types/profile.types';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";
import { BlockReasonModal } from "../../../admin/components/BlockReasonModal";
import CustomerRow from "../../components/admin/CustomerRow";
import Skeleton from "react-loading-skeleton";



export default function Customers() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
    const [customerToBlock, setCustomerToBlock] = useState<{ id: string; name: string } | null>(null);
    const [pendingBlockConfirmation, setPendingBlockConfirmation] = useState<{ id: string; name: string; reason: string } | null>(null);
    const [customerToActivate, setCustomerToActivate] = useState<{ id: string; name: string } | null>(null);

    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [limit] = useState(10);
    const [, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getCustomers = useGetCustomers();
    const updateStatus = useUpdateStatus();

    useEffect(() => {
        getCustomers.mutate({ page, search, filter, limit }, {
            onSuccess: (res: response<{ users: User[]; total: number; totalPages: number }>) => {
                setCustomers(res.data.users);
                setTotal(res.data.total);
                setTotalPages(res.data.totalPages);
            }
        });
    }, [filter, search, page]);

    const handleStatusButton = useCallback((id: string, status: string) => {
        const target = customers.find((u) => u.id === id);
        if (status === "ACTIVE") {
            setCustomerToBlock({ id, name: target?.name || "Customer" });
        } else {
            setCustomerToActivate({ id, name: target?.name || "Customer" });
        }
    }, [customers]);

    const handleProceedToBlockConfirm = useCallback((reason: string) => {
        if (!customerToBlock) return;
        setPendingBlockConfirmation({
            id: customerToBlock.id,
            name: customerToBlock.name,
            reason
        });
        setCustomerToBlock(null);
    }, [customerToBlock]);

    const handleViewCustomer = useCallback((customer: User) => {
        setSelectedCustomer(customer);
    }, []);

    const handleCloseCustomerModal = useCallback(() => {
        setSelectedCustomer(null);
    }, []);

    const confirmBlock = useCallback(() => {
        if (!pendingBlockConfirmation) return;
        updateStatus.mutate({
            id: pendingBlockConfirmation.id,
            status: "BLOCKED",
            reason: pendingBlockConfirmation.reason
        }, {
            onSuccess: (res: response<{ users: User[] }>) => {
                setCustomers((users: User[]) => 
                    users.map((user) => user.id === pendingBlockConfirmation.id ? { ...user, status: "BLOCKED" } : user)
                );
                setPendingBlockConfirmation(null);
                toast.success(res.message);
            }
        });
    }, [pendingBlockConfirmation, updateStatus]);

    const confirmActivate = useCallback(() => {
        if (!customerToActivate) return;
        updateStatus.mutate({
            id: customerToActivate.id,
            status: "ACTIVE"
        }, {
            onSuccess: (res: response<{ users: User[] }>) => {
                setCustomers((users: User[]) => 
                    users.map((user) => user.id === customerToActivate.id ? { ...user, status: "ACTIVE" } : user)
                );
                setCustomerToActivate(null);
                toast.success(res.message);
            }
        });
    }, [customerToActivate, updateStatus]);

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
        {updateStatus.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
        
        <div className="app-content">
                
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>Customer Management</h1>
                    <p className="text-secondary text-sm mb-0">Total platform accounts registered across Customer roles.</p>
                </div>
            </div>
            
            <div className="admin-filter-bar">
                <div className="admin-search-input">
                    <i className="fas fa-search"></i>
                    <input 
                        onChange={(e)=>{
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        type="text" placeholder="Search for email..." id="userSearchInput" 
                     />
                </div>

                <div className="admin-filters-group">


                    <select
                        value={filter}
                        onChange={(e)=>{
                            setFilter(e.target.value)
                            setPage(1)
                        }}
                         className="admin-select" id="statusFilter">
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Suspended</option>
                    </select>

                    <button  className="btn btn-secondary text-xs py-2" onClick={() => handleReset()}>
                        <i className="fas fa-undo mr-1"></i>Reset
                    </button>
                </div>
            </div>

        
            <div className="admin-table-card">
                <div className="admin-table-header">
                    <div className="text-sm font-semibold text-text"></div>
                    <div className="text-xs text-muted"><i className="fas fa-shield-alt mr-1 text-primary"></i>Admin Action Logging Active</div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>Customer Name</th>
                                <th style={{ width: '25%' }}>Email Address</th>
                                <th style={{ width: '15%' }}>Phone</th>
                                <th style={{ width: '15%' }}>Joined Date</th>
                                <th style={{ width: '10%' }}>Account Status</th>
                                <th className="text-right" style={{ width: '15%' }}>Governance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCustomers.isPending ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`customer-skel-${i}`} className="border-b border-border">
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Skeleton circle width={36} height={36} />
                                                <Skeleton width={110} height={15} />
                                            </div>
                                        </td>
                                        <td><Skeleton width="85%" height={15} /></td>
                                        <td><Skeleton width="70%" height={15} /></td>
                                        <td><Skeleton width={80} height={15} /></td>
                                        <td><Skeleton width={65} height={22} borderRadius={12} /></td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Skeleton width={45} height={26} borderRadius={6} />
                                                <Skeleton width={65} height={26} borderRadius={6} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                    <CustomerRow
                                        key={customer.id}
                                        customer={customer}
                                        onView={handleViewCustomer}
                                        onToggleStatus={handleStatusButton}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-secondary">
                                        No customer accounts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
            </div>

                
                <div className="admin-pagination">
                    <div>
                        Showing{" "}
                        <strong>
                            {` ${page} of ${totalPages} pages`}
                        </strong>{" "}
                        
                    </div>

                    <div className="pagination-controls">

                        <button
                            className="page-btn"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {pageNumbers.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`page-btn ${
                                    page === pageNumber ? "active" : ""
                                }`}
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>

                </div>
                </div>
            </div>
        </div>
            
        

        
        <div className={`admin-modal-overlay ${selectedCustomer ? 'active' : ''}`} id="userDetailsModal">
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-id-card text-primary"></i>
                        <h3 className="h6 mb-0">Platform User Dossier</h3>
                    </div>
                    <button className="btn-icon" onClick={handleCloseCustomerModal}><i className="fas fa-times"></i></button>
                </div>
                <div className="admin-modal-body">
                    {selectedCustomer && (
                        <>
                            <div className="text-center mb-6">
                                <img
                                    src={selectedCustomer.customer_profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=6366F1&color=fff`}
                                    className="avatar avatar-lg mx-auto mb-3 border border-border rounded-full"
                                    alt="Avatar"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <h4 className="h5 mb-1 text-text">{selectedCustomer.name}</h4>
                                <span className={`badge ${selectedCustomer.status === 'ACTIVE' ? 'badge-verified' : selectedCustomer.status === 'BLOCKED' ? 'badge-danger-alert' : 'badge-pending'} text-xs`}>
                                    {selectedCustomer.status}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">Email Address</span>
                                    <span className="text-sm font-semibold text-text">{selectedCustomer.email}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">Phone Number</span>
                                    <span className="text-sm font-semibold text-text">{selectedCustomer.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">Location</span>
                                    <span className="text-sm font-semibold text-text">N/A</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">Joined Date</span>
                                    <span className="text-sm font-semibold text-text">{new Date(selectedCustomer.created_at.toString()).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border border-border rounded bg-surface-elevated">
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">Internal ID</span>
                                    <span className="text-xs font-mono text-muted">{selectedCustomer.id}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="admin-modal-footer">
                    <button className="btn btn-secondary text-xs" onClick={handleCloseCustomerModal}>Close</button>
                </div>
            </div>
        </div>

        
            <BlockReasonModal
                isOpen={!!customerToBlock}
                userName={customerToBlock?.name || "Customer"}
                userId={customerToBlock?.id || ""}
                isLoading={updateStatus.isPending}
                onConfirm={handleProceedToBlockConfirm}
                onClose={() => setCustomerToBlock(null)}
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
                isOpen={!!customerToActivate}
                title="Activate Customer"
                message={`Are you sure you want to activate ${customerToActivate?.name}'s account?`}
                confirmText="Activate"
                cancelText="Cancel"
                isDanger={false}
                isLoading={updateStatus.isPending}
                onConfirm={confirmActivate}
                onCancel={() => setCustomerToActivate(null)}
            />
        </>
    );
}
