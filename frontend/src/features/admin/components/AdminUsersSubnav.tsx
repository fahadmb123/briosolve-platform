interface AdminUsersSubnavProps {
    activeTab: 'customers' | 'providers';
    onTabChange: (tab: 'customers' | 'providers') => void;
    customersCount?: number;
    providersCount?: number;
}

export default function AdminUsersSubnav({ 
    activeTab, 
    onTabChange, 
    customersCount, 
    providersCount 
}: AdminUsersSubnavProps) {
    return (
        <div className="admin-subnav-container">
            <nav className="admin-subnav-tabs" aria-label="User Sections">
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'customers' ? 'active' : ''}`}
                    onClick={() => onTabChange('customers')}
                >
                    <i className="fas fa-user text-xs"></i>
                    <span>Customers</span>
                    {typeof customersCount === 'number' && (
                        <span className="admin-subnav-badge">{customersCount}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'providers' ? 'active' : ''}`}
                    onClick={() => onTabChange('providers')}
                >
                    <i className="fas fa-user-tie text-xs"></i>
                    <span>Providers</span>
                    {typeof providersCount === 'number' && (
                        <span className="admin-subnav-badge">{providersCount}</span>
                    )}
                </button>
            </nav>
        </div>
    );
}
