import { useEffect, useState } from "react";
import { useGetCustomers, useUpdateStatus } from '../../hooks/mutations/user.model';
import { toast } from "react-toastify";
import type { User, response } from '../../../../../shared/types/Dtos';
import { SpinnerOverlay } from '../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { ConfirmModal } from "../../../../../shared/components/ui/ConfirmModal/ConfirmModal";

export default function Customers() {
    const [customers,setCustomers] = useState<User[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
    const [customerToChange, setCustomerToChange] = useState<{id: string, status: string} | null>(null)

    const [page, setPage] = useState(0)
    const [search, setSearch] = useState("")
    const [filter,setFilter] = useState("")
    const [limit] = useState(10)
    const [, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)


    const getCustomers = useGetCustomers()
    const updateStatus = useUpdateStatus()
    useEffect(()=>{
        getCustomers.mutate({page,search,filter,limit}, {
            onSuccess: (res: response<{users:User[],total:number,totalPages:number}>) => {
                setCustomers(res.data.users)
                setTotal(res.data.total)
                setTotalPages(res.data.totalPages)
            }
        })
    },[filter,search,page])


    const handleStatusButton = (id:string, status:string)=>{
        setCustomerToChange({ id, status })
    }

    const confirmStatusChange = () => {
        if (!customerToChange) return;
        const passStatus = customerToChange.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
        updateStatus.mutate({id: customerToChange.id, status: passStatus}, {
            onSuccess: (res: response<{users:User[]}>) => {
                setCustomers((users:User[])=> 
                    users.map((user)=>user.id === customerToChange.id ? {...user,status:passStatus} : user)
                )
                setCustomerToChange(null)
                toast.success(res.message)
            }
        })
    }

    const handleReset = () => {
        setSearch("")
        setFilter("")
        setPage(1)
    }
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
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-secondary">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <span className="font-medium">Searching for results...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id} style={customer.status === "BLOCKED" ? { backgroundColor: "rgba(239, 68, 68, 0.03)" } : {}}>
                                        <td>
                                            <div className="font-medium text-text">{customer.name}</div>
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone || 'N/A'}</td>
                                        <td>{new Date(customer.created_at.toString()).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${customer.status === 'ACTIVE' ? 'badge-verified' : customer.status === 'BLOCKED' ? 'badge-danger-alert' : 'badge-pending'}`}>
                                                {customer.status === 'ACTIVE' ? 'Active' : customer.status === 'BLOCKED' ? 'Suspended' : customer.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="btn btn-secondary text-xs py-1 px-2" onClick={() => setSelectedCustomer(customer)}>View</button>
                                                <button onClick={() => handleStatusButton(customer.id,customer.status)} className={`btn text-xs py-1 px-2 ${customer.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}>
                                                    {customer.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
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

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (
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
                    <button className="btn-icon" onClick={() => setSelectedCustomer(null)}><i className="fas fa-times"></i></button>
                </div>
                <div className="admin-modal-body">
                    {selectedCustomer && (
                        <>
                            <div className="text-center mb-6">
                                <img src={`https://ui-avatars.com/api/?name=${selectedCustomer.name}&background=6366F1&color=fff`} className="avatar avatar-lg mx-auto mb-3 border border-border" alt="Avatar" style={{ width: '80px', height: '80px' }} />
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
                    <button className="btn btn-secondary text-xs" onClick={() => setSelectedCustomer(null)}>Close</button>
                </div>
            </div>
        </div>

        
        <div className="admin-modal-overlay" id="suspendModal">
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <div className="flex items-center gap-2 text-danger">
                        <i className="fas fa-exclamation-triangle"></i>
                        <h3 className="h6 mb-0 text-danger">Confirm Account Suspension</h3>
                    </div>
                    <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
                </div>
                <div className="admin-modal-body">
                    <p className="text-sm mb-3">Are you sure you want to suspend <strong id="suspendUserName">User</strong> (<span id="suspendUserId">#ID</span>)?</p>
                    <div className="form-group mb-3">
                        <label className="form-label text-xs">Reason for Administrative Suspension (Logged to Audit Trail)</label>
                        <select className="form-control text-xs" id="suspendReason">
                            <option value="spam">Excessive spam inquiries or fraudulent bidding</option>
                            <option value="investigation">Unresolved contract investigation or policy violation</option>
                            <option value="safety">Customer safety report / verbal misconduct</option>
                            <option value="investigation">Temporary administrative freeze pending review</option>
                        </select>
                    </div>
                    <div className="p-3 bg-danger-light border rounded text-xs text-danger">
                        <i className="fas fa-info-circle mr-1"></i>Suspended users will immediately lose platform access until reinstated by an administrator.
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button className="btn btn-secondary text-xs" onClick={() => {}}>Cancel</button>
                    <button className="btn btn-danger text-xs" onClick={() => {}}>Confirm Suspension</button>
                </div>
            </div>
        </div>
        <ConfirmModal
            isOpen={!!customerToChange}
            title={customerToChange?.status === 'ACTIVE' ? "Suspend Customer" : "Activate Customer"}
            message={customerToChange?.status === 'ACTIVE' 
                ? "Are you sure you want to suspend this customer? They will immediately lose access to the platform." 
                : "Are you sure you want to activate this customer account?"}
            confirmText={customerToChange?.status === 'ACTIVE' ? "Suspend" : "Activate"}
            cancelText="Cancel"
            isDanger={customerToChange?.status === 'ACTIVE'}
            isLoading={updateStatus.isPending}
            onConfirm={confirmStatusChange}
            onCancel={() => setCustomerToChange(null)}
        />
        
        </>
    );
}
