interface AdminCategoriesSubnavProps {
    activeTab: 'categories' | 'services';
    onTabChange: (tab: 'categories' | 'services') => void;
}

export default function AdminCategoriesSubnav({ activeTab, onTabChange }: AdminCategoriesSubnavProps) {
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
                </button>
                <button
                    type="button"
                    className={`admin-subnav-tab ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => onTabChange('services')}
                >
                    <i className="fas fa-tools text-xs"></i>
                    <span>Services</span>
                </button>
            </nav>
        </div>
    );
}

