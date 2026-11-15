interface AdminRequestsSubnavProps {
    activeTab: 'verifications' | 'reactivations';
    onTabChange: (tab: 'verifications' | 'reactivations') => void;
    verificationsCount?: number;
    reactivationsCount?: number;
}

export default function AdminRequestsSubnav({
    activeTab,
    onTabChange,
    verificationsCount,
    reactivationsCount
}: AdminRequestsSubnavProps) {
    return (
        <div className="admin-subnav-container">
            <nav className="admin-subnav-tabs" aria-label="Requests Sections">
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'verifications' ? 'active' : ''}`}
                    onClick={() => onTabChange('verifications')}
                >
                    <i className="fas fa-user-check text-xs"></i>
                    <span>Verifications</span>
                    {typeof verificationsCount === 'number' && (
                        <span className="admin-subnav-badge">{verificationsCount}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'reactivations' ? 'active' : ''}`}
                    onClick={() => onTabChange('reactivations')}
                >
                    <i className="fas fa-user-shield text-xs"></i>
                    <span>Reactivations</span>
                    {typeof reactivationsCount === 'number' && (
                        <span className="admin-subnav-badge">{reactivationsCount}</span>
                    )}
                </button>
            </nav>
        </div>
    );
}

