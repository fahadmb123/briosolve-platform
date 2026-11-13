interface AdminUsersSubnavProps {
    activeTab: 'customers' | 'providers';
    onTabChange: (tab: 'customers' | 'providers') => void;
}

export default function AdminUsersSubnav({ activeTab, onTabChange }: AdminUsersSubnavProps) {
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
                </button>
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'providers' ? 'active' : ''}`}
                    onClick={() => onTabChange('providers')}
                >
                    <i className="fas fa-user-tie text-xs"></i>
                    <span>Providers</span>
                </button>
            </nav>
        </div>
    );
}
