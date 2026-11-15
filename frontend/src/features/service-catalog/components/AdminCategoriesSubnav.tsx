interface AdminCategoriesSubnavProps {
    activeTab: 'categories' | 'services';
    onTabChange: (tab: 'categories' | 'services') => void;
    categoriesCount?: number;
    servicesCount?: number;
}

export default function AdminCategoriesSubnav({
    activeTab,
    onTabChange,
    categoriesCount,
    servicesCount
}: AdminCategoriesSubnavProps) {
    return (
        <div className="admin-subnav-container">
            <nav className="admin-subnav-tabs" aria-label="Catalog Sections">
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => onTabChange('categories')}
                >
                    <i className="fas fa-layer-group text-xs"></i>
                    <span>Categories</span>
                    {typeof categoriesCount === 'number' && (
                        <span className="admin-subnav-badge">{categoriesCount}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => onTabChange('services')}
                >
                    <i className="fas fa-tools text-xs"></i>
                    <span>Services</span>
                    {typeof servicesCount === 'number' && (
                        <span className="admin-subnav-badge">{servicesCount}</span>
                    )}
                </button>
            </nav>
        </div>
    );
}

