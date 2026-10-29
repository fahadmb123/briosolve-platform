import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../shared/hooks/useSidebar';
import { useTheme } from '../shared/hooks/useTheme';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { useLogout } from '../features/auth/hooks/use-otp-varify';
import NotificationDropdown from '../features/notifications/components/NotificationDropdown';
import { CustomerSidebar } from '../shared/components/ui/CustomerSidebar/CustomerSidebar';


export default function CustomerLayout() {
    const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)
    const user = useAuthStore((state) => state.user);
    const profile = useAuthStore((state) => state.profile);
    const logout = useLogout()


    const handleLogout = async () => {
        if(!isAuthenticated) return navigate('/login')
        await logout.mutateAsync()
        clearAuth();
        navigate('/login');
    }

    if (location.pathname.endsWith('/register') || location.pathname.endsWith('/register/')) {
        return <Outlet />;
    }

    return (
        <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <CustomerSidebar
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="app-main">
                <header className="app-header">
                {(() => {
                    const getDashboardRoute = () => {
                        if (!user) return '/login';
                        switch (user.role) {
                            case 'ADMIN': return '/admin/dashboard';
                            case 'PROVIDER': return '/provider/dashboard';
                            default: return '/dashboard';
                        }
                    };

                    return (
                        <>
                <div className="flex items-center gap-3">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar" title="Open Menu" onClick={handleSidebarToggle}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link to="/" className="logo">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>
                </div>

                <div className="navbar-center hide-mobile">
                    <Link to="/nearby-providers" className="nav-item-link">Nearby Providers</Link>
                    <Link to="#" className="nav-item-link">How It Works</Link>
                    <Link to={getDashboardRoute()} className="nav-item-link font-semibold text-primary">Dashboard</Link>
                </div>

                <div className="flex items-center gap-3">
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <NotificationDropdown role="CUSTOMER" viewAllLink="/notifications" />
                    <button onClick={handleLogout} className="btn btn-primary btn-sm hide-mobile">
                        <span>{isAuthenticated ? "Logout" : "Login"}</span>
                    </button>
                    <Link to="/profile" className="avatar avatar-sm ml-2" title="Profile">
                        {profile?.profile_image ? (
                            <img 
                                src={`${profile.profile_image.startsWith('http') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}${profile.profile_image}`} 
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff&rounded=true`;
                                }}
                                alt={user?.name || "User"} 
                            />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff&rounded=true`} alt="User avatar" />
                        )}
                    </Link>
                </div>
                </>
                );
                })()}
            </header>

            <div className="navbar-action-box">
                <Link to="/register" className="btn btn-outline btn-sm">
                    Become a Provider
                </Link>
                <Link to="#" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus mr-1"></i> Post Request
                </Link>
            </div>

                <Outlet />
            </main>
        </div>
    );
}
