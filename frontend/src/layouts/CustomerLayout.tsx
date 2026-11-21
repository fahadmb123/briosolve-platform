import { Outlet, useLocation } from "react-router-dom";
import { CustomerNavbar } from "../shared/components/ui/TopNav/TopNav";
import { CustomerSubnavSidebar } from "../shared/components/ui/CustomerSubnavSidebar/CustomerSubnavSidebar";
import { useAuthStore } from "../features/auth/stores/auth.store";

export default function CustomerLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const verifications = useAuthStore((state) => state.verifications);
  const isVerified = verifications !== null && Object.values(verifications).every(Boolean);
  const showVerificationWarning = Boolean(isAuthenticated && !isAdmin && !isVerified);

  if (
    location.pathname.endsWith("/register") ||
    location.pathname.endsWith("/register/")
  ) {
    return <Outlet />;
  }

  const hasSubnav =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/nearby-providers") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/request-service") ||
    location.pathname.startsWith("/my-requests") ||
    location.pathname.startsWith("/bookings") ||
    location.pathname.startsWith("/wallet") ||
    location.pathname.startsWith("/messages") ||
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/reviews");

  return (
    <div className={`top-nav-layout ${showVerificationWarning ? "has-verification-warning" : ""}`}>
      <CustomerNavbar />
      <div className={`customer-body-layout ${hasSubnav ? "has-subnav" : ""} ${showVerificationWarning ? "has-verification-warning" : ""}`}>
        {hasSubnav && <CustomerSubnavSidebar />}
        <main className={`top-nav-content ${hasSubnav ? "with-sidebar" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
