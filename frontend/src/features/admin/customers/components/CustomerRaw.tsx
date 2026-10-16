import React from "react";
import type { User } from "../../../../shared/types/Dtos";

interface CustomerRowProps {
    customer: User;
    onView: (customer: User) => void;
    onToggleStatus: (id: string, status: string) => void;
}

const CustomerRow = React.memo<CustomerRowProps>(({ customer, onView, onToggleStatus }) => {
    const profile = customer.customer_profile;

    return (
        <tr style={customer.status === "BLOCKED" ? { backgroundColor: "rgba(239, 68, 68, 0.03)" } : {}}>
            <td>
                <div className="customer-info-cell flex items-center gap-2">
                    <img
                        src={profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=6B7C98&color=fff`}
                        className="avatar avatar-sm rounded-full"
                        alt={customer.name}
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                    />
                    <div>
                        <div className="font-medium text-text">{customer.name}</div>
                    </div>
                </div>
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
                    <button className="btn btn-secondary text-xs py-1 px-2" onClick={() => onView(customer)}>View</button>
                    <button onClick={() => onToggleStatus(customer.id, customer.status)} className={`btn text-xs py-1 px-2 ${customer.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}>
                        {customer.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                </div>
            </td>
        </tr>
    );
})
export default CustomerRow